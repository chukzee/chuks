/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import chuks.server.http.HttpConstants;
import chuks.server.http.HttpRequestFormat;
import chuks.server.http.HttpResponseFormat;
import chuks.server.HttpFileObject;
import chuks.server.HttpSession;
import chuks.server.SimpleHttpServerException;
import chuks.server.WebApplication;
import static chuks.server.http.impl.ServerConfig.DEFAULT_INDEX_FILE_EXTENSION;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.nio.ByteBuffer;
import java.nio.channels.SocketChannel;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author USER
 */
abstract class RequestValidator {

    protected final SocketChannel out;
    protected final HttpRequestFormat request;
    byte[] formDataBuffer = null;
    protected boolean isFileData;
    protected boolean isFormFieldValue;
    protected String fileName;
    protected String formFieldName;
    protected Map fileObjMap;
    protected Map fieldMap;
    protected String content_type;
    protected String requestedURIFileName;
    protected String requestedFilePath;
    protected long requestedFileSize;
    private boolean isPossiblyClassFile;
    private RequestFileCacheEntry requestFileCache;
    private HttpSessionImpl httpSession;
    private final boolean isKeepAliveConnection;

    RequestValidator(RequestTask task) throws UnsupportedEncodingException {
        this.out = task.sock;
        this.request = task.request;
        this.requestedURIFileName = request.getURIFileName();
        this.httpSession = task.httpSession;
        this.isKeepAliveConnection = task.isKeepAliveRequestConnection;
    }

    protected void sendResponse(HttpResponseFormat response) {
        try {
            out.write(ByteBuffer.wrap(response.getReponse()));
        } catch (IOException ex) {
            Logger.getLogger(SimpleHttpServer.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

    protected void handleInternalServerError() {
        HttpResponseFormat response = new HttpResponseFormat();
        response.setStatusCode_FileNotFound(request.getProtocolVersion());
        response.setMessageBody(HttpStatusHtml.InternalServerError);
        sendResponse(response);
    }

    protected void handleFileNotFound(String filename) {
        HttpResponseFormat response = new HttpResponseFormat();
        response.setStatusCode_FileNotFound(request.getProtocolVersion());
        response.setMessageBody(HttpStatusHtml.FileNotFound(filename));
        sendResponse(response);
    }

    protected void handleFileTypeNotSupported(String filename) {
        HttpResponseFormat response = new HttpResponseFormat();
        response.setStatusCode_FileTypeNotSupported(request.getProtocolVersion());
        response.setMessageBody(HttpStatusHtml.FileTypeNotSupported(filename));
        sendResponse(response);
    }

    protected void handleForbidden() {
        HttpResponseFormat response = new HttpResponseFormat();
        response.setStatusCode_Forbidden(request.getProtocolVersion());
        response.setMessageBody(HttpStatusHtml.Forbidden);
        sendResponse(response);
    }

    protected void handleBadRequest() {
        HttpResponseFormat response = new HttpResponseFormat();
        response.setStatusCode_BadRequest(request.getProtocolVersion());
        response.setMessageBody(HttpStatusHtml.BadRequest);
        sendResponse(response);
    }

    protected void handleUnsupportedHttpOperation() {
        HttpResponseFormat response = new HttpResponseFormat();
        response.setStatusCode_NotImplemented(request.getProtocolVersion());
        sendResponse(response);
    }

    protected void handleStatusOK() {
        HttpResponseFormat response = new HttpResponseFormat();
        response.setStatusCode_OK(request.getProtocolVersion());
        sendResponse(response);
    }

    //REMIND: SCAN WEB ROOT FILES WHILE CACHING
    private boolean checkRequestRepositry() {

        if (requestedURIFileName.isEmpty()
                || requestedURIFileName.charAt(requestedURIFileName.length() - 1) == '/') {
            requestedFilePath = SimpleHttpServer.getWebRoot() + "index"
                    + (ServerConfig.DEFAULT_INDEX_FILE_EXTENSION.isEmpty() ? "" : "." + DEFAULT_INDEX_FILE_EXTENSION);
            if (ServerConfig.DEFAULT_INDEX_FILE_EXTENSION.equals(ServerConfig.SERVER_FILE_EXT)
                    || ServerConfig.DEFAULT_INDEX_FILE_EXTENSION.equals(SimpleHttpServer.getDiguisedExtension())) {
                isPossiblyClassFile = true;
                return true;
            }

        } else {
            requestedFilePath = SimpleHttpServer.getWebRoot()
                    + requestedURIFileName.replace('/', SimpleHttpServer.fileSeparator());//change the url seperator to that of the OS file seperator
        }

        String file_ext = ServerUtil.getFileType(requestedFilePath);
        //check if it is a class file
        if (file_ext.equals(SimpleHttpServer.getDiguisedExtension())) {
            isPossiblyClassFile = true;
            int index = requestedFilePath.lastIndexOf('.');
            if (index > -1) {
                requestedFilePath = requestedFilePath.substring(0, index) + "." + ServerConfig.SERVER_FILE_EXT;
            } else {
                requestedFilePath = requestedFilePath + "." + ServerConfig.SERVER_FILE_EXT;
            }

            return true;//just return true and leave since we know it is most like a class file - but if it is not we will handle that.
        }

        //At this point it is not a class file
        //First check cache - NOTE: we do not expect class files in this cache. we have cache implementation for theam seperately
        requestFileCache = ServerCache.LRUOptimalCache.get(requestedFilePath);

        if (requestFileCache != null) {

            switch (requestFileCache.status) {
                case RequestFileInfo.FILE_FOUND:
                    content_type = requestFileCache.content_type;
                    requestedFileSize = requestFileCache.data.length;
                    return true;
                case RequestFileInfo.FILE_NOT_FOUND:
                    handleFileNotFound(requestedURIFileName);
                    return false;
                case RequestFileInfo.FILE_TYPE_NOT_SUPPORTED:
                    handleFileTypeNotSupported(requestedURIFileName);
                    return false;
                case RequestFileInfo.FORBIDDEN:
                    handleForbidden();
                    return false;
            }
        }

        //At this point it was not found in cache so check the file system
        Path requested_file_path = FileSystems.getDefault().getPath(requestedFilePath);
        File requested_file = requested_file_path.toFile();
        requestedFileSize = requested_file.length();//important
        if (!requested_file.exists()) {
            //save in cache
            RequestFileCacheEntry cache = new RequestFileCacheEntry(requested_file_path, RequestFileInfo.FILE_NOT_FOUND);
            ServerCache.LRUOptimalCache.put(cache.filePath, cache);
            this.handleFileNotFound(requestedURIFileName);
            return false;
        }

        //At this point the file exist
        //check if the file type is supported
        content_type = ServerUtil.getContentType(requestedFilePath);
        if (content_type == null) {
            //save in cache
            RequestFileCacheEntry cache = new RequestFileCacheEntry(requested_file_path, RequestFileInfo.FILE_TYPE_NOT_SUPPORTED);
            ServerCache.LRUOptimalCache.put(cache.filePath, cache);
            handleFileTypeNotSupported(requestedURIFileName);
            return false;
        }

        //check if the content is forbidden
        if (isContentForbidden(ServerUtil.getFileType(requestedFilePath))) {
            //save in cache
            RequestFileCacheEntry cache = new RequestFileCacheEntry(requested_file_path, RequestFileInfo.FORBIDDEN);
            ServerCache.LRUOptimalCache.put(cache.filePath, cache);
            handleForbidden();
            return false;
        }

        return true;
    }

    abstract void validateRequest(byte[] recv, int offset, int size) throws UnsupportedEncodingException, IOException, SimpleHttpServerException;

    //COME BACK FOR CORRECTNESS
    StringBuilder getCookie() {

        if (request.getCookieSessionToken() == null) {
            StringBuilder cookie = new StringBuilder();
            cookie.append("Set-Cookie: ")
                    .append(UUID.randomUUID().toString());//come back abeg o!!! should be 16 letters and numbers

            return cookie;
        } else {
            StringBuilder cookie = new StringBuilder();
            cookie.append("Set-Cookie: ")
                    .append(request.getCookieSessionToken());
            return cookie;
        }

    }

    protected void notifyWebApp(RequestObject reqestObj) throws UnsupportedEncodingException {

        if (!checkRequestRepositry()) {
            return;
        }

        StringBuilder cookie = getCookie();

        if (!isPossiblyClassFile) {//other type of files
            this.sendResponseFile(content_type, cookie);
            return;
        }

        //We promised to  treat the case of isPossiblyClassFile seperately.
        //At this point it is possibly a class file (server app file). 
        ServerObjectImpl serverObj = new ServerObjectImpl();

        WebApplication web_app = WebAppManager.getWebApp(requestedFilePath, this, serverObj);

        if (web_app == null) {
            return;
        }

        try {

            if (web_app.startSession()) {
                httpSession.setSession(request.getCookiesPair(), request.getCookieSessionToken());
            }

            web_app.onRequest(reqestObj, serverObj);
            web_app.onFinish(serverObj);

        } catch (UnsupportedOperationException ex) {
            handleReceiverError(ex, null);//show the user that he omitted a method implementation
            return;
        }

        StringBuilder echo = serverObj.getHtml();
        byte[] pdf = serverObj.getPdf();
        Exception error = serverObj.getError();

        if (error != null) {
            handleReceiverError(error, echo);
            return;
        }

        if (echo != null) {
            byte[] message_body = echo.toString().getBytes(request.getCharSet());
            this.sendEchoResponse(message_body, "text/html", cookie);
            return;
        }

        if (pdf != null) {
            this.sendEchoResponse(pdf, "application/pdf", cookie);
            return;
        }

        if (echo == null) {//empty
            byte[] message_body = new byte[0];//empty message body
            this.sendEchoResponse(message_body, "text/html", cookie);
        }

    }

    /**
     * This method is called to check if the file exist in the file system after
     * observing the file is not a class file or the server application file.
     * Upon failure to load the file due to ClassNotFoundException exception,
     * this method to called. and the file is checked in the file system whether
     * it exist. It found that it is sent to the client otherwise a response
     * message of File Not Found it sent.
     *
     * @param ex
     */
    void ensureResourceNotFound(ClassNotFoundException ex) {
        if (requestedFilePath.endsWith(".class")) {
            requestedFilePath = requestedFilePath.substring(0, requestedFilePath.length() - 6) + ".html";
        }
        File requested_file = new File(requestedFilePath);
        requestedFileSize = requested_file.length();//important
        if (requested_file.exists()) {
            sendResponseFile(content_type, getCookie());//caching is handled in the method
        } else {
            //save in cache
            RequestFileCacheEntry cache = new RequestFileCacheEntry(Paths.get(requestedFilePath), RequestFileInfo.FILE_NOT_FOUND);
            ServerCache.LRUOptimalCache.put(cache.filePath, cache);
            handleFileNotFound(requestedURIFileName);
        }

    }

    protected void sendEchoResponse(byte[] response_body, String content_type, StringBuilder cookie) {
        try {
            HttpResponseFormat response = new HttpResponseFormat();
            response.setStatusCode_OK(HttpConstants.HTTP_1_1);
            response.setConnection(isKeepAliveConnection ? "open" : "close");
            response.setContentType(content_type);
            if (cookie != null) {
                response.setCookie(cookie.toString());
            }
            //Now if the request contains Origin header
            //the followiing access control must be set
            //otherwise the browse will ignore the server reponse 
            response.setAccessControlAllowOrigin(request.getOrigin());//only this domain is allowed access to the requested resources.
            //response.setAccessControlAllowOrigin("*");//this will allow cross domain resource sharing - full access

            response.setMessageBody(response_body);

            //now send
            out.write(ByteBuffer.wrap(response.getReponse()));

        } catch (IOException ex) {
            Logger.getLogger(GetRequest.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

    protected void sendResponseFile(String content_type, StringBuilder cookie) {

        FileInputStream fin = null;

        try {

            HttpResponseFormat response = new HttpResponseFormat();
            response.setStatusCode_OK(HttpConstants.HTTP_1_1);
            response.setConnection(isKeepAliveConnection ? "open" : "close");
            response.setContentType(content_type);
            if (cookie != null) {
                response.setCookie(cookie.toString());
            }
            //Now if the request contains Origin header
            //the followiing access control must be set
            //otherwise the browse will ignore the server reponse 
            response.setAccessControlAllowOrigin(request.getOrigin());//only this domain is allowed access to the requested resources.
            //response.setAccessControlAllowOrigin("*");//this will allow cross domain resource sharing - full access

            //we will overwrite the content length because we intend to send the headers first then the boby
            response.overwriteContentLength(requestedFileSize);

            //System.out.println("File name ---> " + file.getName());
            //System.out.println(new String(response.getReponse()));
            //now send the headers
            out.write(ByteBuffer.wrap(response.getReponse()));

            //below we will send the body.
            //but first check if we already have it cached
            if (requestFileCache != null) {
                out.write(ByteBuffer.wrap(requestFileCache.data));
                return;
            }

            //Here it is not in the cache so save in cache before sending.
            //but we have to check if the file is eligible for caching
            if (requestedFileSize <= ServerConfig.MAX_REQUEST_CACHE_FILE_SIZE) {
                //ok cache the file before sending
                byte[] file_data = Files.readAllBytes(FileSystems.getDefault().getPath(requestedFilePath));

                //save in cache
                RequestFileCacheEntry cache = new RequestFileCacheEntry(Paths.get(requestedFilePath), RequestFileInfo.FILE_FOUND, content_type, file_data);
                ServerCache.LRUOptimalCache.put(cache.filePath, cache);

                //now send the response
                out.write(ByteBuffer.wrap(file_data));
                return;
            }

            //At this point the file size is too large for caching so we will just send it
            int bytesRead, bytesAvailable, bufferSize;
            byte[] buffer;
            int maxBufferSize = 1 * 1024 * 1024;
            fin = new FileInputStream(requestedFilePath);
            bytesAvailable = fin.available();
            bufferSize = Math.min(bytesAvailable, maxBufferSize);
            buffer = new byte[bufferSize];
            // read file and write it into form...
            bytesRead = fin.read(buffer, 0, bufferSize);

            while (bytesRead > 0) {
                out.write(ByteBuffer.wrap(buffer, 0, bytesRead));
                bytesAvailable = fin.available();
                bufferSize = Math.min(bytesAvailable, maxBufferSize);
                bytesRead = fin.read(buffer, 0, bufferSize);
            }

        } catch (IOException ex) {
            Logger.getLogger(GetRequest.class.getName()).log(Level.SEVERE, null, ex);
            handleInternalServerError();
        } finally {
            try {
                if (fin != null) {
                    fin.close();
                }
            } catch (IOException ex) {
                Logger.getLogger(GetRequest.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    protected void handleReceiverError(Exception error, StringBuilder html) {
        if (!SimpleHttpServer.isErrorOutputEnabled()) {
            sendEchoResponse(new byte[0], "text/html", null);//send nothing
            return;
        }
        StackTraceElement[] ex_arr = error.getStackTrace();
        StringBuilder exStr = new StringBuilder();
        exStr.append("<div style='color:red;'>").append(error.getMessage()).append("<br/>");
        for (int i = 0; i < ex_arr.length; i++) {
            exStr.append(ex_arr[i].toString()).append("<br/>");
        }

        exStr.append("</div>");
        exStr.append("<br/>");
        exStr.append(html);

        sendEchoResponse(exStr.toString().getBytes(), "text/html", null);
    }

    /**
     * check if it is a forbidden content. Forbidden content are content that
     * can not be view by the outside world e.g server side script used in this
     * server.
     *
     * @param type
     * @return
     */
    protected boolean isContentForbidden(String type) {

        switch (type) {

            //case "php":
            //   return true;
            //case "asp":
            //  return true;
            //case "aspx":
            //  return true;    
            //case "jsp":
            //  return true;
        }

        return false;
    }

    class HttpFileObjectImpl implements HttpFileObject {

        private String fileName;
        private String path;
        private long file_length;
        private String ext;
        private File TmpFile;

        public HttpFileObjectImpl() {
        }

        @Override
        public boolean moveTo(String file_path) {
            File f = new File(file_path);
            File p = f.getParentFile();
            if (p != null) {
                if (!p.exists()) {
                    p.mkdirs();//create any necessary sub directories as well.
                }
            }
            if (TmpFile.renameTo(f)) {
                path = file_path;
                return true;
            }

            return false;
        }

        @Override
        public String getFilename() {
            return fileName;
        }

        @Override
        public String getFileExtension() {
            return ext;
        }

        @Override
        public long getFileSize() {
            return this.file_length;
        }

        void setFilename(String name) {
            ext = name.substring(name.lastIndexOf('.') + 1);
            this.fileName = name;
        }

        void setFileSize(long file_length) {
            this.file_length = file_length;
        }

        void setTemporaryFile(File TmpFile) {
            path = TmpFile.getPath();
            this.TmpFile = TmpFile;
        }

        @Override
        public byte[] getContent() throws IOException {
            return Files.readAllBytes(FileSystems.getDefault().getPath(path));
        }

        @Override
        public InputStream getContentInputStream() throws IOException {
            return new FileInputStream(path);
        }
    }
}
