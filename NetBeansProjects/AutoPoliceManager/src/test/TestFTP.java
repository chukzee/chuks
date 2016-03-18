/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.SocketException;
import java.util.logging.Level;
import java.util.logging.Logger;
import manager.util.AutoPoliceConstants;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import org.apache.commons.net.io.Util;

/**
 *
 * @author USER
 */
public class TestFTP {

    public static void main(String args[]) {
        System.setProperty("java.net.preferIPv4Stack", "true");
        String file = "C:\\test\\AsynClientNIO2.jar";
        String filename = sendPhotoToServerByFTP(file);
        System.out.println(filename);
    }

    static private String sendPhotoToServerByFTP(String filename) {
        //send the photo to the server
        String username = "chuks";//REMIND: must be class variable
        String password = "chukspass";//REMIND: must be class variable
        String ftp_host = "localhost";//REMIND: must be class variable
        String zone = "1";
        String division = "B";
        String insert_id = "1786";
        String kidnaper_base_dir = "kidnaper_photos";
        int ftp_port = 21;//REMIND: must be class variable

        String ext = getFileExtension(filename);

        String remote_path_filename = null; // initailze to null - important
        FTPClient ftpClient = new FTPClient();
        FileInputStream fin = null;
        try {
            ftpClient.connect(ftp_host, ftp_port);
            ftpClient.login(username, password);
            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
            File file = new File(filename);
            fin = new FileInputStream(file);
            //images/kidnaper_
            kidnaper_base_dir = AutoPoliceConstants.CRIMINAL_PHOTO_PREFIX_DIR;
            zone = "zone 1";
            division = "division A";
            String kidnaper_path = kidnaper_base_dir+"kidnaper photo" + "/" + zone + "/" + division + "/";
            boolean result = ftpClient.makeDirectory(kidnaper_path);

            if (!result) {
                throw new SocketException("Could not create remote directory");
            }

            result = ftpClient.changeWorkingDirectory(kidnaper_path);

            if (!result) {
                throw new SocketException("Could not change to working directory");
            }

            String kdp_filename = insert_id + "." + ext;
            remote_path_filename = "/"+kidnaper_path + kdp_filename;

            result = ftpClient.storeFile(kdp_filename, fin);

            if (!result) {
                throw new SocketException("File transfer failed");
            }

            System.out.println("File transfered successfully");

        } catch (IOException ex) {
            Logger.getLogger(TestFTP.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
                if (fin != null) {
                    fin.close();
                }
            } catch (IOException ex) {
                Logger.getLogger(TestFTP.class.getName()).log(Level.SEVERE, null, ex);
            }
            try {
                ftpClient.logout();
            } catch (IOException ex) {
                Logger.getLogger(TestFTP.class.getName()).log(Level.SEVERE, null, ex);
            }
            try {
                ftpClient.disconnect();
            } catch (IOException ex) {
                Logger.getLogger(TestFTP.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return remote_path_filename;
    }

    public static String getFileExtension(String filename) {
        int index = filename.lastIndexOf(".");
        if (index < 0) {
            return "";
        }
        return filename.substring(index + 1);
    }

}
