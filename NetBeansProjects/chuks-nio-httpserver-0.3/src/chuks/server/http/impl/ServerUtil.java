/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import chuks.server.SimpleHttpServerException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Random;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author USER
 */
class ServerUtil {

    private static String text = "text/";
    private static String image = "image/";
    private static String video = "video/";
    private static String audio = "audio/";
    private static String application = "application/";
    private static String font = "font/";
    private static Random random = new Random();

    public static String getFileType(String filename) {
        int last_index = filename.lastIndexOf('.');
        if (last_index == -1) {
            return "";
        }
        return filename.substring(last_index + 1).toLowerCase();
    }

    public static void checkValidRemoteCacheAddress(String rmt_addr) throws Exception {
        if (SimpleHttpServer.isStop()) {
            throw new SimpleHttpServerException("invalid method call - server not running");
        }
        checkValidRemoteCacheAddress(SimpleHttpServer.getHost() + ":" + SimpleHttpServer.getPort(), rmt_addr);
    }

    public static void checkValidRemoteCacheAddress(String addr1, String addr2) throws SimpleHttpServerException {
        String[] local_split = addr1.split(":");
        String lc_host = local_split[0];
        int lc_port = -1;
        String[] split = addr2.split(":");
        String rmt_host = split[0];
        int rmt_port = -1;
        try {
            lc_port = Integer.parseInt(local_split[1]);
        } catch (NumberFormatException numberFormatException) {
            throw new SimpleHttpServerException("invalid cache address ("+addr1+") port number - "+lc_port);
        }try {
            rmt_port = Integer.parseInt(split[1]);
        } catch (NumberFormatException numberFormatException) {
            throw new SimpleHttpServerException("invalid cache address ("+addr2+") port number - "+rmt_port);
        }
        try {
            if (InetAddress.getByName(lc_host).equals(InetAddress.getByName(rmt_host))) {
                if (rmt_port == lc_port) {
                    throw new SimpleHttpServerException("invalid cache address - "+addr1+" repeated");
                }
            }
        } catch (UnknownHostException ex) {
           throw new SimpleHttpServerException("invalid cache address - "+ex.getMessage());
        }
    }

    public static String[] validateCacheAdresses(String[] cache_addrs) throws SimpleHttpServerException{
        
        for(int i=0; i<cache_addrs.length; i++){
            String[] split = cache_addrs[i].split(":");
            if(split.length==1)
                throw new SimpleHttpServerException("invalid remote cache socket address");
            String addr = split[0].trim()+":"+split[1].trim();   
            cache_addrs[i]=addr;
        }
        
        for(int i=0; i<cache_addrs.length; i++){
            for(int k=0; k<cache_addrs.length; k++){
                if(k==i)
                    continue;
                checkValidRemoteCacheAddress(cache_addrs[i], cache_addrs[k]);
            }
        }
                
        return cache_addrs;
    }
    
    public static String getContentType(String filename) {
        int last_index = filename.lastIndexOf('.');
        if (last_index == -1) {
            return application + "octet-stream";//come back
        }

        String type = filename.substring(last_index + 1).toLowerCase();

        switch (type) {
            case "html":
                return text + type;

            case "php":
                return text + "html";//COME BACK - WILL BE REMOVED SINCE IT IS A KNOW SERVER SCRIPT

            case "js":
                return application + "javascript";
            case "css":
                return text + type;
            case "font":
                return new StringBuffer(font).append("otf; ")
                        .append(font).append("ttf; ")
                        .append(font).append("opentype; ")
                        .append(application).append("font-otf; ")
                        .append(application).append("font-woff; ")
                        .append(application).append("x-font-type1; ")
                        .append(application).append("x-font-ttf; ")
                        .append(application).append("x-truetype-font; ")
                        .toString();//may be more
            case "png":
                return image + type;
            case "jpg":
                return image + type;
            case "gif":
                return image + type;
            case "jpeg":
                return image + type;
            case "pdf":
                return application + type;

            default:
                return application + "octet-stream";//last resort if we do not know the type 
        }

    }

    public static boolean findStringIgnoreCase(String[] strs, String s) {
        for (String sc : strs) {
            if (sc.equalsIgnoreCase(s)) {
                return true;
            }
        }
        return false;
    }

    public static long getAllowableBufferSize() {
        long max_per_allow = Runtime.getRuntime().freeMemory() / 4;
        return max_per_allow / Thread.activeCount();
    }

    public byte[] appendByte(byte[] b1, byte[] b2) {
        byte[] new_b = new byte[b1.length + b2.length];
        System.arraycopy(b1, 0, new_b, 0, b1.length);
        System.arraycopy(b2, 0, new_b, b1.length, b2.length);
        return new_b;
    }

    public static long randomNextLong() {
        return random.nextLong();
    }

    public static int randomNextInt() {
        return random.nextInt();
    }

    public static void close(Connection conn) {
        try {
            if (conn != null) {
                conn.close();
            }
        } catch (SQLException ex) {
            Logger.getLogger(ServerUtil.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public static void close(Statement stmt) {
        try {
            if (stmt != null) {
                stmt.close();
            }
        } catch (SQLException ex) {
            Logger.getLogger(ServerUtil.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public static void close(ResultSet rs) {
        try {
            if (rs != null) {
                rs.close();
            }
        } catch (SQLException ex) {
            Logger.getLogger(ServerUtil.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
