/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import chuks.server.HttpSession;
import chuks.server.SimpleHttpServerException;
import java.io.*;
import java.net.Socket;
import java.util.logging.*;
import chuks.server.http.*;
import static chuks.server.http.impl.SimpleHttpServer.getLoadBalanceStrategy;
import java.net.SocketException;
import java.nio.ByteBuffer;
import java.nio.channels.SocketChannel;
import java.util.List;

/**
 *
 * @author USER
 */
class RequestTask implements Runnable {

    private boolean isAllHttpHeadersEnd;
    private byte[] http_headers_bytes = new byte[0];
    HttpRequestFormat request;
    private int totalBytesRecieved;
    int headersLength;
    StringBuilder boundary;
    boolean hasBoundary;
    char[] final_boundary_end;
    char[] sub_boundary_end;
    int final_boundary_end_length;
    int sub_boundary_end_length;
    SocketChannel sock;
    StringBuffer content_headers = null;
    StringBuffer form_data_value = null;
    byte[] formDataBuffer = null;
    private PostRequest postRequest;
    private GetRequest getRequest;
    private HeadRequest headRequest;
    private PutRequest putRequest;
    private DeleteRequest deleteRequest;
    int content_length;
    String requestCharSet;
    boolean isFormUrlEncoded;
    private boolean finished;
    ByteBuffer distBuff = ByteBuffer.allocate(512);//CHANGE BACK TO 512 A BEG O!!!
    private boolean is_buff_len_set;
    boolean isKeepAliveRequestConnection;
    long time1 = System.nanoTime();//TESTING
    private List<EventPacket> eventPack;
    HttpSessionImpl httpSession;
    int current_read_size;
    boolean hasMutiRequest;
    private int request_length;
    private int content_len_remain;
    private int size_recv_after_header;

    public RequestTask(SocketChannel socket) {
        this.sock = socket;
    }

    void initialize() {


        isAllHttpHeadersEnd = false;
        request = null;
        totalBytesRecieved = 0;
        headersLength = 0;
        boundary = null;
        hasBoundary = false;
        final_boundary_end = null;
        sub_boundary_end = null;
        final_boundary_end_length = 0;
        sub_boundary_end_length = 0;
        //sock = null;//initialization not required
        content_headers = null;
        form_data_value = null;
        formDataBuffer = null;
        postRequest = null;
        getRequest = null;
        headRequest = null;
        putRequest = null;
        deleteRequest = null;
        content_length = 0;
        requestCharSet = null;
        isFormUrlEncoded = false;
        finished = false;
        //distBuff = ByteBuffer.allocate(512);//initialization not required
        is_buff_len_set = false;
        //isKeepAliveRequesConnection = false;//initialization not required 
        eventPack = null;
        httpSession = null;
        request_length = 0;
        //http_headers_bytes = null;//important! initialization not required
        //multi_request_read_offset = 0;//important! initialization not required 
        //current_read_size = -1;//important! initialization not required 
        //multi_request_length = 0;//important! initialization not required 
        //hasMutiRequest =false;//important! initialization not required 

    }

    int read() {
        try {
            if (hasMutiRequest) {
                return current_read_size;//don't read until all requests are consumed
            }
            current_read_size = sock.read(distBuff);
            totalBytesRecieved += current_read_size;
            return current_read_size;
        } catch (IOException ex) {
            Logger.getLogger(RequestTask.class.getName()).log(Level.SEVERE, null, ex);
        }
        return -1;//signal end
    }

    SocketChannel geChannel() {
        return sock;
    }

    boolean isContentFullyRead() {
        return finished;
    }

    void printTimeElapse() {//TESTING
        System.out.println("elapse " + (System.nanoTime() - time1) / Math.pow(10.0, 9));
    }
    int test_count;

    @Override
    public void run() {

        try {
            //REMIND: Denial of service DOS is possible here. So timing a connection is imperative - use Thread interrupt to exist the connection

            analyzeHttpRecv(distBuff.array());

            if (hasMutiRequest) {
                if (!isKeepAliveRequestConnection) {
                    finished = true;//multi request is only permitted in keep alive connection
                }
                return;
            }

            distBuff.clear();

            //testingToDisplayUploadedRate();//TO BE REMOVED ABEG O!!!

            if (isAllHttpHeadersEnd) {

                if (ServerConfig.isLoadBalancingEnabled()) {
                    String redirectAddr = getLoadBalanceStrategy().getRedirectServerAddress();
                    if (redirectAddr != null) {
                        redirectRequest(redirectAddr);
                        finished = true;
                        isKeepAliveRequestConnection = false;//prevent keep alive
                        return;
                    }
                }

                //create the http session object required for reference later
                httpSession = new HttpSessionImpl();//important

                if (!is_buff_len_set) {

                    //System.out.println(new String(distBuff.array(), 0, byte_size_read));
                    //System.out.println("test count " + test_count);

                    distBuff = ByteBuffer.allocate(bestBufferSize(content_length));
                    is_buff_len_set = true;
                }


                //send server event packet
                if (eventPack != null) {
                    sendEventPacket();
                }
            }

        } catch (UnsupportedEncodingException ex) {
            Logger.getLogger(SimpleHttpServer.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(SimpleHttpServer.class.getName()).log(Level.SEVERE, null, ex);
        } catch (HttpContentLengthException | SimpleHttpServerException ex) {
            Logger.getLogger(RequestTask.class.getName()).log(Level.SEVERE, null, ex);
        }

    }
    int last_p = -1;

    void testingToDisplayUploadedRate() {
        double percent = totalBytesRecieved / (double) (headersLength + content_length) * 100;
        int p = (int) percent;
        if (p % 5 == 0 && last_p != p) {
            System.out.println(p + "% read");
            last_p = p;
        }

    }

    private void handleUnknownRequest() throws IOException {
        HttpResponseFormat response = new HttpResponseFormat();
        response.setStatusCode_NotImplemented(request.getProtocolVersion());
        sock.write(ByteBuffer.wrap(response.getReponse()));
        finished = true; // force task to be terminated
    }

    private void handleRequest(byte[] arr, int offset, int size) throws UnsupportedEncodingException, IOException, SimpleHttpServerException {

        if (size == 0) {//avoid this! causes some problems - like duplicate request!
            return;//leave here!
        }

        switch (request.Method()) {
            case HttpConstants.GET_METHOD:
                if (getRequest == null) {
                    getRequest = new GetRequest(this);
                }
                this.getRequest.validateRequest(arr, offset, size);
                break;
            case HttpConstants.POST_METHOD:
                if (postRequest == null) {
                    postRequest = new PostRequest(this);
                }
                this.postRequest.validateRequest(arr, offset, size);
                break;
            case HttpConstants.HEAD_METHOD:
                if (headRequest == null) {
                    headRequest = new HeadRequest(this);
                }
                this.putRequest.validateRequest(arr, offset, size);
                break;
            case HttpConstants.PUT_METHOD:
                if (putRequest == null) {
                    putRequest = new PutRequest(this);
                }
                this.putRequest.validateRequest(arr, offset, size);
                break;
            case HttpConstants.DELETE_METHOD:
                if (deleteRequest == null) {
                    deleteRequest = new DeleteRequest(this);
                }
                this.deleteRequest.validateRequest(arr, offset, size);
                break;
            default:
                handleUnknownRequest();//close connection  
            }

    }

    void analyzeHttpRecv(byte[] arr) throws HttpContentLengthException, UnsupportedEncodingException, IOException, SimpleHttpServerException {

        int offset = 0;
        if (isAllHttpHeadersEnd) {
            int prev_size_recv_after_header = size_recv_after_header;
            size_recv_after_header += current_read_size;

            if (size_recv_after_header <= content_len_remain) {
                handleRequest(arr, 0, current_read_size);//uncoment later

                /*System.out.println("-----  CONTENT CONSUMED STILL MAY REMAIN ---------");
                 * System.out.println(new String(arr, 0, current_read_size));
                 * System.out.println("-----------------------------------");*/

                return;
            }
            //At this point it appears to be multi-requests on same connection - i.e another request follows afterwards
            int size = content_len_remain - prev_size_recv_after_header;
            handleRequest(arr, 0, size);//uncoment later
            http_headers_bytes = new byte[0];//initialize
            offset = size;//set the offset to the start of the a headers

            /*System.out.println("-----  CONTENT CONSUMED WITH EXCESS ---------");
             * System.out.println(new String(arr, 0, size));
             * System.out.println("-----------------------------------");*/

        }


        if (hasMutiRequest) {
            //extract the remaining request part
            byte[] r = new byte[http_headers_bytes.length - request_length];
            System.arraycopy(http_headers_bytes, request_length, r, 0, r.length);
            http_headers_bytes = r;
        } else {
            byte[] r = new byte[http_headers_bytes.length + current_read_size - offset];
            int index = offset - 1;
            for (int i = 0; i < r.length; i++) {
                if (i < http_headers_bytes.length) {
                    r[i] = http_headers_bytes[i];
                } else {
                    r[i] = arr[++index];
                }
            }

            http_headers_bytes = r;
        }

        headersLength = 0;
        isAllHttpHeadersEnd = false;
        size_recv_after_header = 0;

        for (int i = 0; i < http_headers_bytes.length; i++) {

            if (i > 2
                    && http_headers_bytes[i - 3] == '\r'
                    && http_headers_bytes[i - 2] == '\n'
                    && http_headers_bytes[i - 1] == '\r'
                    && http_headers_bytes[i] == '\n') {
                if (headersLength == 0) {
                    headersLength = i + 1;
                }
                isAllHttpHeadersEnd = true;

            }
        }

        if (!isAllHttpHeadersEnd) {
            hasMutiRequest = false;

            /*System.out.println("-----  INCOMPLETE HEADERS ---------");
             * System.out.println(new String(http_headers_bytes, 0, http_headers_bytes.length));
             * System.out.println("-----------------------------------");*/

            return;
        }

        //get content length

        //REMIND: CONSIDER UNKNOWN CONTENT LENGTH LIKE IN CASE OF CHUNK TRASNFER
        request = new HttpRequestFormat();

        request.setRequest(new String(http_headers_bytes, 0, http_headers_bytes.length));//uncoment later
        content_length = request.getContentLength();//uncoment later
        cahcheRequestProperties();//uncoment later

        //content_length = 11;//TESTING ABEG O!!! REMOVE LATER ABEG O!!!

        request_length = headersLength + content_length;

        if (http_headers_bytes.length > request_length) {

            hasMutiRequest = true;
            //consume the request
            handleRequest(http_headers_bytes, headersLength, headersLength + content_length);//uncoment later
            isAllHttpHeadersEnd = false;//there are still more to go!
            content_len_remain = 0;

            /*System.out.println("----- MULTI REQUEST---------");
             * System.out.println(new String(http_headers_bytes));
             * System.out.println("----------------------------");
             * System.out.println("----- MULTI REQUEST CONTENT---------");
             * System.out.println(new String(http_headers_bytes, 0, headersLength + content_length));
             * System.out.println("----------------------------");*/

        } else {
            hasMutiRequest = false;
            content_len_remain = headersLength + content_length - http_headers_bytes.length;
            handleRequest(http_headers_bytes, headersLength, http_headers_bytes.length);//uncoment later

            /*System.out.println("----- NOT MULTI REQUEST---------");
             * System.out.println(new String(http_headers_bytes));
             * System.out.println("--------------------------------");
             * System.out.println("-----NOT MULTI REQUEST CONTENT PART SIZE---------");
             * System.out.println(new String(http_headers_bytes, 0, http_headers_bytes.length));
             * System.out.println("----------------------------");*/
        }

        //System.out.println(headersLength);

    }

    private void cahcheRequestProperties() {
        boundary = request.getBoundary();
        if (boundary != null && boundary.length() > 0) {
            hasBoundary = true;
            final_boundary_end = request.getFinalBoundaryEnd().toString().toCharArray();
            sub_boundary_end = request.getSubBoundaryEnd().toString().toCharArray();

            final_boundary_end_length = final_boundary_end.length;
            sub_boundary_end_length = sub_boundary_end.length;
        }

        if (request.isFormUrlEncoding()) {
            isFormUrlEncoded = true;
        }

        requestCharSet = request.getCharSet();

        if (request.getConnection().equalsIgnoreCase("keep-alive")) {
            isKeepAliveRequestConnection = true;
        }

        //more specific cache to improve performance may go here
    }

    private int bestBufferSize(int content_length) throws SocketException {

        if (content_length > 10000000) {
            sock.socket().setReceiveBufferSize(65536);//64K
            return 2 * 65536;//2 * 64K
        } else if (content_length > 1000000) {
            sock.socket().setReceiveBufferSize(32768);//32K
            return 32768;//32K
        } else if (content_length > 100000) {
            sock.socket().setReceiveBufferSize(16384);//16K
            return 16384;//16K
        } else if (content_length > 10000) {
            sock.socket().setReceiveBufferSize(4096);//4K
            return 4096;//4K
        } else {
            sock.socket().setReceiveBufferSize(1024);//1K
            return 1024;//1K
        }

    }

    void close() {
        try {
            sock.close();
        } catch (IOException ex) {
            Logger.getLogger(RequestTask.class.getName()).log(Level.SEVERE, null, ex);
        } catch (NullPointerException ex) {
            //shouldn't get here anyway
            Logger.getLogger(RequestTask.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    boolean isKeepAliveConnection() {
        return isKeepAliveRequestConnection;
    }

    private void redirectRequest(String redirectAddr) {
        try {
            //NOT FULLY IMPLEMENTED - COME BACK ABEG O!!!
            System.err.println("redirectRequest - NOT FULLY IMPLEMENTED - COME BACK ABEG O!!!");
            HttpResponseFormat response = new HttpResponseFormat();
            response.setStatusCode_Redirect(HttpConstants.HTTP_1_1);//come back
            //response.setRidrect(redirectAddr)//Haba  find out abeg o!!!
            sock.write(ByteBuffer.wrap(response.getReponse()));
            sock.close();//come back to check for effect while writing
        } catch (IOException ex) {
            Logger.getLogger(RequestTask.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    String getSessionID() {
        if (httpSession == null) {
            return null;
        }
        return httpSession.getID();
    }

    void setEventPacket(List q) {

        if (eventPack == null) {
            eventPack = q;
        } else {
            eventPack.addAll(q);
        }

    }

    private void sendEventPacket() throws IOException {

        for (int i = 0; i < eventPack.size(); i++) {

            EventPacket pack = eventPack.remove(i);


            HttpResponseFormat response = new HttpResponseFormat();
            response.setStatusCode_OK(HttpConstants.HTTP_1_1);
            response.setConnection("open");
            response.setContentType(pack.getContentType());

            //Now if the request contains Origin header
            //the followiing access control must be set
            //otherwise the browse will ignore the server reponse 
            response.setAccessControlAllowOrigin(request.getOrigin());//only this domain is allowed access to the requested resources.
            //response.setAccessControlAllowOrigin("*");//this will allow cross domain resource sharing - full access

            response.setMessageBody(pack.getData());

            //now send
            sock.write(ByteBuffer.wrap(response.getReponse()));
        }
    }
}
