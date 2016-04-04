package test;


import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class TestUploadToServer{
     
        
    String upLoadServerUri = null;
     
    /**********  File Path *************/
    final String uploadFilePath = "/mnt/sdcard/";
    final String uploadFileName = "service_lifecycle.png";
     
    void setServerURI(String uri){
        upLoadServerUri = uri;
    }
    
    public int uploadFile(String sourceFileUri) {
           
          int serverResponseCode = 0;
           
          String fileName = sourceFileUri;
  
          HttpURLConnection conn = null;
          DataOutputStream dos = null; 
          String lineEnd = "\r\n";
          String twoHyphens = "--";
          String boundary = "*****";
          int bytesRead, bytesAvailable, bufferSize;
          byte[] buffer;
          int maxBufferSize = 1 * 1024 * 1024;
          File sourceFile = new File(sourceFileUri);
          System.out.println("file size  "+sourceFile.length());
          if (!sourceFile.isFile()) {
               
                
               System.err.println("Source File not exist :"
                                   +uploadFilePath + "" + uploadFileName);
                
               return 0;
            
          }
          else
          {
               try {
                    
                     // open a URL connection to the Servlet
                   FileInputStream fileInputStream = new FileInputStream(sourceFile);
                   URL url = new URL(upLoadServerUri);
                    
                   // Open a HTTP  connection to  the URL
                   conn = (HttpURLConnection) url.openConnection();
                   conn.setDoInput(true); // Allow Inputs
                   conn.setDoOutput(true); // Allow Outputs
                   conn.setUseCaches(false); // Don't use a Cached Copy
                   conn.setRequestMethod("POST");
                   //conn.setRequestProperty("Connection", "Keep-Alive");
                   conn.setRequestProperty("ENCTYPE", "multipart/form-data");
                   conn.setRequestProperty("Content-Type", "multipart/form-data;boundary=" + boundary);
                   conn.setRequestProperty("uploaded_file", fileName);
                  
                   
                   dos = new DataOutputStream(conn.getOutputStream());
                   
                   dos.writeBytes(twoHyphens + boundary + lineEnd);
                   dos.writeBytes("Content-Disposition: form-data; name=\"uploaded_file\";filename=\""+ fileName + "\"" + lineEnd);
                          
                   dos.writeBytes(lineEnd);
                   
                   // create a buffer of  maximum size
                   bytesAvailable = fileInputStream.available();
          
                   bufferSize = Math.min(bytesAvailable, maxBufferSize);
                   buffer = new byte[bufferSize];
          
                   // read file and write it into form...
                   bytesRead = fileInputStream.read(buffer, 0, bufferSize); 
                   int count =  0; 
                   while (bytesRead > 0) {
                     count +=  bytesRead;   
                     dos.write(buffer, 0, bytesRead);
                     bytesAvailable = fileInputStream.available();
                     bufferSize = Math.min(bytesAvailable, maxBufferSize);
                     bytesRead = fileInputStream.read(buffer, 0, bufferSize);  
                      
                    }
          
                   System.out.println("file size  sent " + count);
                   
                   System.out.println("send multipart form data necesssary after file data...\n"
                           +twoHyphens + boundary + twoHyphens + lineEnd);
                   
                   // send multipart form data necesssary after file data...
                   dos.writeBytes(lineEnd);
                   dos.writeBytes(twoHyphens + boundary + twoHyphens + lineEnd);
                   // Responses from the server (code and message)
                   serverResponseCode = conn.getResponseCode();
                   String serverResponseMessage = conn.getResponseMessage();
                     
                   System.out.println("HTTP Response is : "
                           + serverResponseMessage + ": " + serverResponseCode);
                    
                   if(serverResponseCode == 200){
                       String msg = "File Upload Completed.";
                       
                       System.out.println(msg);   
                   }   
                    
                   //close the streams //
                   fileInputStream.close();
                   dos.flush();
                   dos.close();
                     
              } catch (MalformedURLException ex) {
                   
                  ex.printStackTrace();
                   
                  System.err.println("error: " + ex.getMessage()); 
              } catch (Exception e) {
                   
                  e.printStackTrace();
                   
                  System.err.println("error: " + e.getMessage()); 
              }
              return serverResponseCode;
               
           } // End else block
         }
    
    public static void main(String args[]){
        
        TestUploadToServer t = new TestUploadToServer();
        t.setServerURI("http://localhost/traysa/test_upload.php");
        //t.setServerURI("http://45.79.137.25:6000/");
        t.uploadFile("C:\\Users\\USER\\Documents\\Wildlife.wmv");//text_upload
        //t.uploadFile("C:\\Users\\USER\\Documents\\text_upload.txt");//
    }
}