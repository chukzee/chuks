/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.request;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * The class accepts connections and coordination the processing of requests. It
 * coordinate the processing of request by ensuring that fair enough opportunity
 * is given to each connection.It tries to avoid a situation where one
 * connection with very large request would cause the starvation of others.So,
 * instead of completing the large request at a go, it rather process part then
 * give other requests opportunity to be processed. When a part of the large
 * request is completed the task is re-added to the queue but to the tail as if
 * its request just arrived. Thus allowing other tasks (requests) up in the
 * queue to be processed thereby giving fair enough opportunity of each request.
 *
 * @author Chuks Alimele<chuksalimele@yahoo.com>
 */
class ServerHandler implements Runnable {

    static boolean isRunning;
    private static ServerHandler serverHandler;
    final private static Object lock = new Object();
    static ThreadPoolExecutor requestThreadPoolExecutor;
    static int corePoolSize = 2;
    static int maxPoolSize = 100;
    static int threadIdleTime = 30;//in seconds
    static int totalQueueSize = 5000;//come back
    private static boolean isStarted;
    private static final LinkedBlockingQueue<RequestTask> tasks
            = new LinkedBlockingQueue();//we prefer LinkedBlockingQueue to ConcurrentLinkedQueue in this case because of size computation in ConcurrentLinkedQueue. see size method of ConcurrentLinkedQueue

    private static final LinkedBlockingQueue<Runnable> rejectedTask
            = new LinkedBlockingQueue();//we prefer LinkedBlockingQueue to ConcurrentLinkedQueue

    private final int TASK_OVER_FLOW_SIZE = 500;

    private ServerHandler() {
    }

    static ServerHandler getInstance() {
        if (serverHandler != null) {
            return serverHandler;
        }
        synchronized (lock) {
            if (serverHandler == null) {
                return serverHandler = new ServerHandler();
            }
        }
        return serverHandler;
    }

    @Override
    public void run() {
        ServerSocketChannel sock_chanel = null;
        try {

            sock_chanel = ServerSocketChannel.open();
            sock_chanel.bind(new InetSocketAddress(SimpleHttpServer.getHost(), SimpleHttpServer.getPort()), 100);
            sock_chanel.configureBlocking(false);

            System.out.println("INFO: server is bound to " + SimpleHttpServer.getHost() + ":" + SimpleHttpServer.getPort());

            SocketChannel socket;
            int rejeceted_size;
            while (isRunning) {

                try {
                    rejeceted_size = rejectedTask.size();

                    if (rejeceted_size < TASK_OVER_FLOW_SIZE) {//only accept connection if rejected task is less than TASK_OVER_FLOW_SIZE.
                        socket = sock_chanel.accept();
                        if (socket != null) {
                            //socket.setOption(SocketOption., ...);
                            socket.configureBlocking(false);
                            RequestTask requestTask = new RequestTask(socket);
                            tasks.offer(requestTask);//add - prefer the method offer() to add()
                            //System.out.println(socket);//TESTING!!! - TO BE REMOVED
                        }

                    }

                    if (rejeceted_size > 0) {
                        RequestTask rjtd = (RequestTask) rejectedTask.poll();//retrieve and remove - we re-execute this task
                        if (rjtd != null) {
                            //System.out.println("add back rejected "+rjtd);
                            tasks.offer(rjtd);//add back
                        }
                    }

                    RequestTask r = tasks.poll();//retrieve and remove
                    if (r == null) {
                        continue;
                    }

                    int read_size = r.read();

                    if (read_size > 0) {
                        requestThreadPoolExecutor.execute(r);
                        continue;
                    }

                    if (read_size == 0) {
                        tasks.offer(r);//put back but to the tail - NOTE we prefer the method offer() to add()
                        continue;
                    }

                    if (read_size == -1) {
                        r.close();
                    }

                } catch (IOException ex) {
                    Logger.getLogger(SimpleHttpServer.class.getName()).log(Level.SEVERE, null, ex);
                } catch (NullPointerException ex) {
                    Logger.getLogger(SimpleHttpServer.class.getName()).log(Level.SEVERE, null, ex);
                } catch (Exception ex) {
                    Logger.getLogger(SimpleHttpServer.class.getName()).log(Level.SEVERE, null, ex);
                }

            }
        } catch (UnknownHostException ex) {
            Logger.getLogger(SimpleHttpServer.class.getName()).log(Level.SEVERE, null, ex);
            isRunning = false;
            requestThreadPoolExecutor.shutdownNow();
        } catch (IOException ex) {
            Logger.getLogger(SimpleHttpServer.class.getName()).log(Level.SEVERE, null, ex);
            isRunning = false;
            requestThreadPoolExecutor.shutdownNow();
        }

        System.err.println("server handler terminated");

        if (sock_chanel != null) {
            if (!sock_chanel.socket().isBound()) {
                System.exit(-1);
            }
        }

    }

    void start() {

        synchronized (lock) {
            if (isStarted) {
                return;
            }
            isStarted = true;
        }
        BlockingQueue<Runnable> connectionsQueue = new ArrayBlockingQueue(totalQueueSize);
        requestThreadPoolExecutor
                = new ThreadPoolExecutor(corePoolSize,
                        maxPoolSize, threadIdleTime,
                        TimeUnit.SECONDS, connectionsQueue) {//extending ThreadPoolExecutor

                    /**
                     * Override afterExecute() to finish off the task. if the
                     * request content length is known and the request is not
                     * fully read and processed then the task is re-inserted to
                     * the queue for further processing. This allow other
                     * smaller tasks to get quickly executed before a larger
                     * request is complete
                     *
                     *
                     * @param r
                     * @param t
                     */
                    @Override
                    protected void afterExecute(Runnable r, Throwable t) {
                        super.afterExecute(r, t);
                        //come back to consiber Throwable
                        RequestTask task = (RequestTask) r;
                        if (!task.isContentFullyRead()) {
                            tasks.offer(task);//put back but to the tail - NOTE we prefer the method offer() to add()
                        } else if (task.isKeepAliveConnection()) {
                            //System.out.println("task.isKeepAliveConnection()");
                            task.initialize();//first initialize necessary variables
                            tasks.offer(task);//put back but to the tail - NOTE we prefer the method offer() to add()                            
                        } else {
                            task.close();
                        }

                        //REMOVE THIS IF BLOCK LATER - USED FO TESTING
                        if (task.isContentFullyRead()) {//TESTING - REMOVE IF BLOCK LATER
                            //task.printTimeElapse();//TESTING
                        }
                    }

                };

        requestThreadPoolExecutor.setRejectedExecutionHandler(new RejectedExecutionHandler() {
            @Override
            public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
                rejectedTask.offer(r);//we do not want to loose any task - we shall send it back to the queue for execution - NOTE we prefer the method offer() to add()
            }
        });

        new Thread(serverHandler).start();
    }

    void stop() {
        isRunning = false;
    }
}
