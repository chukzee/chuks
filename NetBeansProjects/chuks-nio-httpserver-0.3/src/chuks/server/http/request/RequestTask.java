/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.request;

import chuks.server.SimpleHttpServerException;
import java.io.*;
import java.net.Socket;
import java.util.logging.*;
import chuks.server.http.*;
import java.net.SocketException;
import java.nio.ByteBuffer;
import java.nio.channels.SocketChannel;

/**
 *
 * @author USER
 */
class RequestTask implements Runnable {

    private int carriageReturnIndex = -1;//ie \r
    private int newLineIndex = -1;//ie \n
    private int line_1_index = -1;//ie \r\n
    private int line_2_index = -1;//ie \r\n        
    private int requestIndex = -1;
    private boolean isAllHttpHeadersEnd;
    private byte[] headers_collection_bytes = new byte[0];//if the buffer of the header is not in one read operation
    private boolean isOneOperationReadHeaders = true;//assuming true
    private HttpRequestFormat request;
    private int totalBytesRecieved;
    int headersLength;
    StringBuilder boundary;
    boolean hasBoundary;
    char[] final_boundary_end;
    char[] sub_boundary_end;
    int final_boundary_end_length;
    int sub_boundary_end_length;
    private SocketChannel sock;
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
    ByteBuffer distBuff = ByteBuffer.allocate(512);
    private boolean is_buff_len_set;
    private int byte_size_read = -1;
    private boolean isKeepAliveRequesConnection;

    long time1 = System.nanoTime();//TESTING

    public RequestTask(SocketChannel socket) {
        this.sock = socket;
    }

    void initialize(){
        
        carriageReturnIndex = -1;//ie \r
        newLineIndex = -1;//ie \n
        line_1_index = -1;//ie \r\n
        line_2_index = -1;//ie \r\n        
        requestIndex = -1;
        isAllHttpHeadersEnd = false;
        headers_collection_bytes = new byte[0];//if the buffer of the header is not in one read operation
        isOneOperationReadHeaders = true;//assuming true
        request= null;
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
        isFormUrlEncoded=false;
        finished = false;
        //distBuff = ByteBuffer.allocate(512);//initialization not required
        is_buff_len_set = false;
        byte_size_read = -1;
        //isKeepAliveRequesConnection = false;//initialization not required 

    }
    
    int read() {
        try {
            return byte_size_read = sock.read(distBuff);
        } catch (IOException ex) {
            Logger.getLogger(RequestTask.class.getName()).log(Level.SEVERE, null, ex);
        }
        return -1;//signal end
    }

    SocketChannel geChannel(){
        return sock;
    }
    
    boolean isContentFullyRead() {
        return finished;
    }

    void printTimeElapse() {//TESTING
        System.out.println("elapse " + (System.nanoTime() - time1) / Math.pow(10.0, 9));
    }

    @Override
    public void run() {
        
        try {
            //REMIND: Denial of service DOS is possible here. So timing a connection is imperative - use Thread interrupt to exist the connection
            
            analyzeHttpRecv(distBuff.array(), byte_size_read);
            
            distBuff.clear();
            //testingToDisplayUploadedRate();//TO BE REMOVED ABEG O!!!
            if (isAllHttpHeadersEnd) {
                if (!is_buff_len_set) {
                    //System.out.println(new String(distBuff.array()));
                    distBuff = ByteBuffer.allocate(bestBufferSize(content_length));
                    is_buff_len_set = true;
                }
                if (totalBytesRecieved >= headersLength + content_length) {
                    //System.out.println("over");
                    finished = true;
                }
            }

        } catch (UnsupportedEncodingException ex) {
            Logger.getLogger(SimpleHttpServer.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(SimpleHttpServer.class.getName()).log(Level.SEVERE, null, ex);
        } catch (HttpContentLengthException ex) {
            Logger.getLogger(RequestTask.class.getName()).log(Level.SEVERE, null, ex);
        } catch (SimpleHttpServerException ex) {
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

    private void handleUnknownRequest() {
    }

    private void handleRequest(byte[] arr, int offset, int size) throws UnsupportedEncodingException, IOException, SimpleHttpServerException {

        switch (request.Method()) {
            case HttpConstants.GET_METHOD:
                if (getRequest == null) {
                    getRequest = new GetRequest(request, sock, this);
                }
                this.getRequest.validateRequest(arr, offset, size);
                break;
            case HttpConstants.POST_METHOD:
                if (postRequest == null) {
                    postRequest = new PostRequest(request, sock, this);
                }
                this.postRequest.validateRequest(arr, offset, size);
                break;
            case HttpConstants.HEAD_METHOD:
                if (headRequest == null) {
                    headRequest = new HeadRequest(request, sock, this);
                }
                this.putRequest.validateRequest(arr, offset, size);
                break;
            case HttpConstants.PUT_METHOD:
                if (putRequest == null) {
                    putRequest = new PutRequest(request, sock, this);
                }
                this.putRequest.validateRequest(arr, offset, size);
                break;
            case HttpConstants.DELETE_METHOD:
                if (deleteRequest == null) {
                    deleteRequest = new DeleteRequest(request, sock, this);
                }
                this.deleteRequest.validateRequest(arr, offset, size);
                break;
            default:
                handleUnknownRequest();//close connection  
            }

    }

    private void analyzeHttpRecv(byte[] arr, int size) throws HttpContentLengthException, UnsupportedEncodingException, IOException, SimpleHttpServerException {

        totalBytesRecieved += size;

        if (isAllHttpHeadersEnd) {
            handleRequest(arr, 0, size);
            return;
        }

        //long time1 = System.nanoTime();
        if (!this.isAllHttpHeadersEnd) {
            for (int i = 0; i < size; i++) {

                requestIndex++;

                if (arr[i] != '\r' && arr[i] != '\n') {
                    line_1_index = -1;
                    line_2_index = -1;
                    continue;
                }

                if (arr[i] == '\r') {
                    this.carriageReturnIndex = requestIndex;
                    continue;
                }

                if (arr[i] == '\n') {
                    this.newLineIndex = requestIndex;
                }

                if (carriageReturnIndex > -1 && newLineIndex - carriageReturnIndex == 1) {
                    if (line_1_index == -1) {
                        line_1_index = newLineIndex;
                        continue;
                    }

                    if (line_2_index == -1) {
                        line_2_index = newLineIndex;
                        if (line_2_index - line_1_index == 2) {
                            this.isAllHttpHeadersEnd = true;
                            headersLength = line_2_index + 1;
                            break;
                        }
                    }
                }

            }
        }

        if (!isAllHttpHeadersEnd) {
            isOneOperationReadHeaders = false;
        }

        if (!isOneOperationReadHeaders) {
            byte[] r = new byte[this.headers_collection_bytes.length + size];
            int index = -1;
            for (int i = 0; i < r.length; i++) {
                if (i < headers_collection_bytes.length) {
                    r[i] = headers_collection_bytes[i];
                } else {
                    index++;
                    r[i] = arr[index];
                }
            }

            headers_collection_bytes = r;
        }

        //System.out.println("ELASPSE REQEST " + (System.nanoTime() - time1) / Math.pow(10.0, 9));
        if (request == null && isAllHttpHeadersEnd) {
            request = new HttpRequestFormat();
            if (isOneOperationReadHeaders) {
                request.setRequest(new String(arr, 0, size));
            } else {//multiple read operation lead to the ends of all headers
                request.setRequest(new String(headers_collection_bytes));
            }
            content_length = request.getContentLength();
            cahcheRequestProperties();
            handleRequest(arr, headersLength, size);
        }

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

        if(request.getConnection().equalsIgnoreCase("keep-alive")){
            isKeepAliveRequesConnection = true;
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
        return isKeepAliveRequesConnection;
    }
}
