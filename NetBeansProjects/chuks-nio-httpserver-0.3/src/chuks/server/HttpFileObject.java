/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server;

import java.io.IOException;
import java.io.InputStream;

/**
 *
 * @author USER
 */
public interface HttpFileObject {
    
        /**Moves the file to the specified location in the file system.<p>
         * Many aspects of the behavior of this method are inherently platform-dependent: 
         * The move operation might not be atomic, and it might not succeed if a
         * file with the destination abstract pathname already exists. The return 
         * value should always be checked to make sure that the move operation was successful.
         * 
         * <p>
         * <strong>NOTE:</strong>If the only operation to perform on this file is just to save it
         * in the file system then calling this method is by far more recommended
         * than using <code>getContent()</code> or <code>getContentInputStream()</code>
         * to first obtain the file data only to save it afterwards without any
         * intermediate manipulation.
         * <p>
         * 
         * @param file_path the file path
         * @return true if operation succeeds otherwise false
         */
        boolean moveTo(String file_path); 

        /**Buffers the content of this file to memory.<p>
         * Use this method if specific manipulation of the file
         * data is intended. see <code>moveTo</code> for when you
         * just want to only save the file.
         * 
         * @return the file data
         * @throws IOException 
         */
        byte[] getContent() throws IOException;
        
        /**Obtain the input stream for the file content.<p>
         * Use this method if specific manipulation of the file
         * data is intended. see <code>moveTo</code> for when you
         * just want to only save the file.
         * 
         * @return the file data
         * @throws IOException 
         */
        InputStream getContentInputStream() throws IOException;

        /**The name of the file associated with the request.
         * 
         * @return the file name
         */        
        String getFilename();
        
        /**The extension of the file associated with the request.
         * 
         * @return the file extension
         */        
        String getFileExtension(); 

        /**The size of the file.
         * 
         * @return the file size
         */        
        long getFileSize();
}
