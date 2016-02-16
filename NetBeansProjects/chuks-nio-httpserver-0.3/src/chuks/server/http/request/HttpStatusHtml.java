/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.request;

/**
 *
 * @author USER
 */
class HttpStatusHtml {
    
    static byte[] BadRequest = ("<!DOCTYPE HTML PUBLIC \"-//IETF//DTD HTML 2.0//EN\">\n" +
                                    "<html><head>\n" +
                                    "<title>404 Bad Request</title>\n" +
                                    "</head><body>\n" +
                                    "<h1>Bad Request</h1>\n" +
                                    "</body></html>").getBytes();
    
    static byte[] InternalServerError =("<!DOCTYPE HTML PUBLIC \"-//IETF//DTD HTML 2.0//EN\">\n" +
                                    "<html><head>\n" +
                                    "<title>500 Internal Server Error</title>\n" +
                                    "</head><body>\n" +
                                    "<h1>Internal Server Error</h1>\n" +
                                    "<p>Sorry, there was a problem while processing the request.</p>\n" +
                                    "</body></html>").getBytes();
    static byte[] Forbidden =("<!DOCTYPE HTML PUBLIC \"-//IETF//DTD HTML 2.0//EN\">\n" +
                                    "<html><head>\n" +
                                    "<title>403 Forbidden</title>\n" +
                                    "</head><body>\n" +
                                    "<h1>Forbidden</h1>\n" +
                                    "</body></html>").getBytes();
    
    static byte[] FileTypeNotSupported(String filename){
        return  ("<!DOCTYPE HTML PUBLIC \"-//IETF//DTD HTML 2.0//EN\">\n" +
                                    "<html><head>\n" +
                                    "<title>Not Supported</title>\n" +
                                    "</head><body>\n" +
                                    "<h1>File Type Not Supported</h1>\n" +
                                    "<p>The requested URL "+filename+" has a file file type not supportd.</p>\n" +
                                    "</body></html>").getBytes();
    }
    
    
    static byte[] FileNotFound(String filename){
        return  ("<!DOCTYPE HTML PUBLIC \"-//IETF//DTD HTML 2.0//EN\">\n" +
                                    "<html><head>\n" +
                                    "<title>404 Not Found</title>\n" +
                                    "</head><body>\n" +
                                    "<h1>Not Found</h1>\n" +
                                    "<p>The requested URL "+filename+" does not exist in the remote machine.</p>\n" +
                                    "</body></html>").getBytes();
    }
}
