/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.request;

import chuks.server.SimpleHttpServerException;
import chuks.server.SimpleServerApplication;
import static chuks.server.http.request.SimpleHttpServer.*;
import static chuks.server.http.request.ServerConfig.*;
import chuks.server.util.ThreadUtil;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import static java.nio.file.LinkOption.NOFOLLOW_LINKS;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import static java.nio.file.StandardWatchEventKinds.ENTRY_CREATE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_DELETE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_MODIFY;
import static java.nio.file.StandardWatchEventKinds.OVERFLOW;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author USER
 */
class WebAppManager implements Runnable {

    
    /**
     * Hold the initialized web apps (ie classes that implements SimpleServerApplication)
     */
    private static Map<String, SimpleServerApplication> webAppMap = new HashMap(); //no need for synchronized collection here since the access  is in synchronized block - see implementation below
    
    /**
     * Hold the Class object of the web apps (ie classes that implements SimpleServerApplication) loaded by the Bootstrap class during server start up
     */
    private static Map<String, Class> webAppClassObjectsMap = new HashMap(); //no need for synchronized collection here since the access  is in synchronized block - see implementation below
    //private static String classPath;
    private final static Object c_lock = new Object();
    private static boolean isClassFilesChange;
    private static WebAppClassLoader lastClassLoader;
    private static SimpleHttpServerException initException;
    private final WatchService watcher;
    private final Map<WatchKey, Path> keys;
    private boolean trace = false;
    static private WebAppManager serverAppManager;
    static private boolean isStarted;

    private WebAppManager() throws IOException {
        this.watcher = FileSystems.getDefault().newWatchService();
        this.keys = new HashMap<>();

    }

    static WebAppManager getInstance() throws IOException {

        if (serverAppManager != null) {
            return serverAppManager;
        }
        synchronized (c_lock) {
            if (serverAppManager == null) {
                return serverAppManager = new WebAppManager();
            }
        }
        return serverAppManager;
    }

    void start() {
        if (isStarted) {
            return;
        }
        synchronized (c_lock) {
            if (isStarted) {
                return;
            }
            isStarted = true;
        }

        new Thread(serverAppManager).start();
    }

    static SimpleServerApplication getWebApp(String classAbsoluteFilename, RequestValidator requestValidator, ServerObjectImpl serverObj) {

        String className = classAbsoluteFilename.substring(getClassPath().length(), classAbsoluteFilename.length() - SERVER_FILE_EXT.length() - 1);
        className = className.replace(fileSeparator(), '.');//Yes - replace all occurence of OS file seperator with '.' . Yes replace() does replace all the char occurence - see doc 
        SimpleServerApplication ssr;
        try {
            synchronized (c_lock) {
                if (!isClassFilesChange) {
                    ssr = webAppMap.get(className);
                    if (ssr != null) {
                        return (SimpleServerApplication) ssr.initialize(serverObj);//return fresh copy - that which has not been used.
                    }

                    if (lastClassLoader == null) {
                        lastClassLoader = new WebAppClassLoader(WebAppManager.class.getClassLoader());
                    }
                    ssr = checkFileSystem(className, classAbsoluteFilename, lastClassLoader, requestValidator, serverObj);//ok load from the file system;
                } else {

                    //At this point the class files have changed
                    webAppMap.clear();
                    webAppClassObjectsMap.clear();
                    isClassFilesChange = false;//set to false since we have initialize the class loader anyway.
                    WebAppClassLoader classLoader = new WebAppClassLoader(WebAppManager.class.getClassLoader());
                    ssr = checkFileSystem(className, classAbsoluteFilename, classLoader, requestValidator, serverObj);//ok load from the file system;
                }
            }//end of sync
        } catch (Exception ex) {
            requestValidator.handleReceiverError(ex, null);
            return null;
        }
        if (initException != null) {
            requestValidator.handleReceiverError(initException, null);
        }

        return ssr;
    }

    static private SimpleServerApplication checkFileSystem(String className, String classAbsoluteFilename, WebAppClassLoader classLoader, RequestValidator requestValidator, ServerObjectImpl serverObj) {

        //check the cache once more if you were a waiter during lock
        //because we want to try as much as possible
        //to skip the reload of the class and java reflection below which altogether is expensive.
        SimpleServerApplication ssr = webAppMap.get(className);//check cache again
        if (ssr != null) {
            try {
                return (SimpleServerApplication) ssr.initialize(serverObj);//return fresh copy - that which has not been used.
            } catch (Exception ex) {
                requestValidator.handleReceiverError(ex, null);
                return null;
            }
        }

        //Ok, we've done our best, we've got no choice but to go for the class reload and java reflection.
        //The condition above will try as much as possible to limit execution below this point
        initException = null;
        try {

            Class<?> cl;
            try {
                //well check if the class was loaded by our Bootstrap.class 
                if ((cl = webAppClassObjectsMap.get(className)) == null) {
                    lastClassLoader = classLoader;
                    classLoader.setClassAbsoluteFileName(classAbsoluteFilename);
                    cl = classLoader.loadClass(className); //loadClass is already synchronized in ClassLoader so we are safe
                     
                    /*similaryly use Class.forNam(...). except that Class.forName(...) 
                     *can be used for Class initialization( ie static initializtion) if the
                     *initialize parameter is set to true
                     c = Class.forName(className, false, classLoader);
                     */
                    
                }
            } catch (ClassNotFoundException ex) {
                requestValidator.ensureResourceNotFound(ex);
                return null;
            }

            SimpleServerApplication sr = (SimpleServerApplication) cl.newInstance();
            //store a fresh copy in the map rather than use reflection next time
            SimpleServerApplication freshCopy;
            try {
                freshCopy = (SimpleServerApplication) sr.initialize(serverObj); // initialize() should return a fresh copy
                freshCopy.callOnce(serverObj);//called only once for the entire exist of the SimpleServerApplication Class
            } catch (Exception ex) {
                requestValidator.handleReceiverError(ex, null);
                return null;
            }
            //check the validity of the copy
            boolean sameClass = freshCopy.getClass().equals(sr.getClass());
            if (!sameClass
                    || freshCopy.equals(sr)) {
                //invalid fresh copy since the class of freshCopy and sr must be the same
                //and the objects must not be equal.
                initException = new SimpleHttpServerException("incorrectly initialized " + classAbsoluteFilename + " - expected: new " + sr.getClass().getName() + "()");
                sr.onError(new ServerObjectImpl(null, null), initException);//notify error 
                throw initException;
            }

            webAppMap.put(className, freshCopy);//store the fresh copy

            return sr;//return this instance since we already have a fresh copy for another server app

        } catch (ClassCastException |
                InstantiationException |
                IllegalAccessException |
                SimpleHttpServerException ce) {
            Logger.getLogger(WebAppManager.class.getName()).log(Level.SEVERE, null, ce);
        }

        return null;
    }

    static boolean loadWebApp(String classAbsoluteFilename) {
        String className = classAbsoluteFilename.substring(getClassPath().length(), classAbsoluteFilename.length() - SERVER_FILE_EXT.length() - 1);
        className = className.replace(fileSeparator(), '.');
        synchronized (c_lock) {
            try {
                if (webAppClassObjectsMap.get(className) != null
                        || webAppMap.get(className) != null) {
                    return false;//already loaded
                }

                //load it
                if (lastClassLoader == null) {
                    lastClassLoader = new WebAppClassLoader(WebAppManager.class.getClassLoader());
                }
                lastClassLoader.setClassAbsoluteFileName(classAbsoluteFilename);
                Class<?> cl = lastClassLoader.loadClass(className);
                webAppClassObjectsMap.put(className, cl);
                //cl.newInstance();//Testing
                //Logger.getLogger(WebAppManager.class.getName()).log(Level.INFO, "Loaded : {0}"+"."+SERVER_FILE_EXT, className);
                return true;
            } catch (Exception ex) {
                Logger.getLogger(WebAppManager.class.getName()).log(Level.SEVERE, null, ex);
            }
            return false;
        }
    }

    @SuppressWarnings("unchecked")
    static <T> WatchEvent<T> cast(WatchEvent<?> event) {
        return (WatchEvent<T>) event;
    }

    /**
     * Register the given directory with the WatchService
     */
    private void register(Path dir) throws IOException {
        WatchKey key = dir.register(watcher, ENTRY_CREATE, ENTRY_DELETE, ENTRY_MODIFY);
        if (trace) {
            Path prev = keys.get(key);
            if (prev == null) {
                System.out.format("register: %s\n", dir);
            } else {
                if (!dir.equals(prev)) {
                    System.out.format("update: %s -> %s\n", prev, dir);
                }
            }
        }
        keys.put(key, dir);
    }

    /**
     * Register the given directory, and all its sub-directories, with the
     * WatchService.
     */
    private void registerAll(final Path start1, final Path start2) throws IOException {
        // register directory and sub-directories
        if (start1 != null) {
            Files.walkFileTree(start1, new SimpleFileVisitor<Path>() {
                @Override
                public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs)
                        throws IOException {
                    register(dir);
                    return FileVisitResult.CONTINUE;
                }
            });
        }

        if (start2 != null) {
            Files.walkFileTree(start2, new SimpleFileVisitor<Path>() {
                @Override
                public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs)
                        throws IOException {
                    register(dir);
                    return FileVisitResult.CONTINUE;
                }
            });
        }
    }
    int count = 0;

    /**
     * Process all events for keys queued to the watcher
     */
    void processFileChangeEvents() {
        for (;;) {

            // wait for key to be signalled
            WatchKey key;
            try {
                key = watcher.take();
            } catch (InterruptedException x) {
                Logger.getLogger(WebAppManager.class.getName()).log(Level.SEVERE, null, x);
                return;
            }

            Path dir = keys.get(key);
            if (dir == null) {
                System.err.println("WatchKey not recognized!!");
                continue;
            }

            for (WatchEvent<?> event : key.pollEvents()) {
                WatchEvent.Kind kind = event.kind();

                // TBD - provide example of how OVERFLOW event is handled
                if (kind == OVERFLOW) {
                    continue;
                }

                // Context for directory entry event is the file name of entry
                WatchEvent<Path> ev = cast(event);
                Path name = ev.context();
                Path child = dir.resolve(name);

                // print out event
                // System.out.format("%s: %s\n", event.kind().name(), child);
                if (kind == ENTRY_MODIFY || kind == ENTRY_DELETE) {
                    System.out.println(count++ + "   " + dir);//testing

                    synchronized (c_lock) {
                        isClassFilesChange = true; //flag file change for the next waiting thread to create new class loader
                    }

                    String file_path = child.toString();
                    if (ServerCache.LRUOptimalCache.containsKey(file_path)) {
                        ServerCache.LRUOptimalCache.remove(file_path);
                    }

                    if (child.getParent().equals(getPathClassPath())) {
                        //Whenever any file in the class path is modified the index file in the cache must be remove.
                        //since the default index file extension configuration settings might change at runtime, it
                        //we be safer to remove the index file from cache with every modification of class path files.

                        //remove any index file 
                        if (file_path.endsWith(fileSeparator() + "index.html")) {
                            ServerCache.LRUOptimalCache.remove(file_path);
                        }

                        if (file_path.endsWith(fileSeparator() + "index." + DEFAULT_INDEX_FILE_EXTENSION)) {
                            ServerCache.LRUOptimalCache.remove(file_path);
                        }

                        if (file_path.endsWith(fileSeparator() + "index")) {
                            ServerCache.LRUOptimalCache.remove(file_path);
                        }
                    }
                }

                // if directory is created, and watching recursively, then
                // register it and its sub-directories
                if (kind == ENTRY_CREATE) {
                    try {
                        if (Files.isDirectory(child, NOFOLLOW_LINKS)) {
                            registerAll(child, null);
                        }
                    } catch (IOException x) {
                        // ignore to keep sample readbale
                        Logger.getLogger(WebAppManager.class.getName()).log(Level.SEVERE, null, x);
                    }
                }
            }

            // reset key and remove from set if directory no longer accessible
            boolean valid = key.reset();
            if (!valid) {
                keys.remove(key);

                // all directories are inaccessible
                if (keys.isEmpty()) {
                    System.err.println("All directories are not accessible");
                    break;
                }
            }

            //waitForSomeTime();//we don't want too much rate of detection to avoid too many class loader create during say a case of copying directory in this class path 
        }
    }

    @Override
    public void run() {

        Path dirPath1 = Paths.get(SimpleHttpServer.getClassPath());
        Path dirPath2 = Paths.get(SimpleHttpServer.getWebRoot());

        while (!SimpleHttpServer.isStop()) {
            try {
                System.out.format("INFO: Scanning %s ...\n", SimpleHttpServer.getClassPath());
                if (!dirPath1.equals(dirPath2)) {
                    System.out.format("INFO: Scanning %s ...\n", SimpleHttpServer.getWebRoot());
                }

                registerAll(dirPath1, dirPath2);

                System.out.println("INFO: finished scanning...");

                // enable trace after initial registration
                this.trace = true;

                this.processFileChangeEvents();

                Thread.sleep(2000);

            } catch (IOException ex) {
                Logger.getLogger(WebAppManager.class.getName()).log(Level.SEVERE, null, ex);
            } catch (Exception ex) {
                Logger.getLogger(WebAppManager.class.getName()).log(Level.SEVERE, null, ex);
            }

        }
        System.out.println("Receiver Watch Service Ends");
    }

    private void waitForSomeTime() {
        ThreadUtil.sleep(3000);
    }

}
