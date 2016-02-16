/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.request;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.ResourceBundle;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.commons.configuration.PropertiesConfigurationLayout;

/**
 *
 * @author USER
 */
public abstract class ServerConfig {

    final private static String resourceConfigAttr = "resources.configAttributes";
    final private static String resourceConfigComments = "resources.configComments";
    final private static String resourceConfigDefaults = "resources.configDefaults";

    final public static String FILE_SEPARATOR = "/";
    final public static String SERVER_FILE_EXT = "class";//this server uses java class extension
    final public static String TEMP_DIR;
    static File TEMP_FILE_DIR;
    static int MAX_CACHE_SEND_TRIALS;//see resource bundle
    static int MAX_REMOTE_CACHE_HANDLER_THREADS;//see resource bundle
    static int MAX_MEMORY_CACHE_SIZE;//see resource bundle
    static int MAX_MEMORY_CACHE_IDLE_TIME;//see resource bundle
    static int MAX_DISK_CACHE_IDLE_TIME;//see resource bundle

    public static String[] remoteCacheAddresses = {};

    /**
     * more comprehensive configuration properties
     */
    static PropertiesConfiguration propertiesConfig;

    final public static int DEFAULT_SOCK_TIMEOUT = 30000;
    static long MAX_REQUEST_CACHE_FILE_SIZE;
    static String DEFAULT_INDEX_FILE_EXTENSION;

    static {

        TEMP_DIR = System.getProperty("java.io.tmpdir");

        ResourceBundle d = ResourceBundle.getBundle(resourceConfigDefaults);

        MAX_CACHE_SEND_TRIALS = Integer.parseInt(d.getString(Attr.MaxSendRemoteCacheTrials.name()));
        MAX_REMOTE_CACHE_HANDLER_THREADS = Integer.parseInt(d.getString(Attr.MaxRemoteCacheHandlerThreads.name()));
        MAX_MEMORY_CACHE_SIZE = Integer.parseInt(d.getString(Attr.MaxMemoryCacheSize.name()));
        MAX_REQUEST_CACHE_FILE_SIZE = Integer.parseInt(d.getString(Attr.MaxReqestCacheFileSize.name()));
        DEFAULT_INDEX_FILE_EXTENSION = d.getString(Attr.DefaultIndexFileExtension.name());
        if (DEFAULT_INDEX_FILE_EXTENSION == null) {
            DEFAULT_INDEX_FILE_EXTENSION = "";
        }
        //MAX_MEMORY_CACHE_IDLE_TIME = Integer.parseInt(d.getString(Attr.MaxMemoryCacheIdleTime.name()));
        //MAX_DISK_CACHE_IDLE_TIME = Integer.parseInt(d.getString(Attr.MaxDiskCacheIdleTime.name()));

    }

    public static int getMaxCacheSendTrails() {
        return MAX_CACHE_SEND_TRIALS;
    }

    public static String getTempDir() {
        return TEMP_DIR;
    }

    public static int getMaxCacheHandlerThreads() {
        return MAX_REMOTE_CACHE_HANDLER_THREADS;
    }

    public static ResourceBundle getConfigAttrBundle() {
        return ResourceBundle.getBundle(resourceConfigAttr);
    }

    public static ResourceBundle getConfigCommentsBundle() {
        return ResourceBundle.getBundle(resourceConfigComments);
    }

    public static void printDefaultConfig() {
        ResourceBundle b = ResourceBundle.getBundle(resourceConfigAttr);
        Enumeration<String> k = b.getKeys();

        while (k.hasMoreElements()) {
            System.out.println(b.getString(k.nextElement()) + " = ");
        }
    }

    public static void writeDefaultConfig(String filename, boolean add_comments) throws IOException {

        try (FileOutputStream fin = new FileOutputStream(filename)) {
            ResourceBundle b = ResourceBundle.getBundle(resourceConfigAttr);
            Enumeration<String> k = b.getKeys();
            ResourceBundle d = ResourceBundle.getBundle(resourceConfigDefaults);
            Set cd = d.keySet();
            String[] values = new String[cd.size()];
            cd.toArray(values);
            ResourceBundle bc = ResourceBundle.getBundle(resourceConfigComments);
            Set c = bc.keySet();
            String[] comments = new String[c.size()];
            c.toArray(comments);
            while (k.hasMoreElements()) {
                String kn = k.nextElement();
                String comm = "";
                if (add_comments) {
                    for (String comment : comments) {
                        if (comment.equals(kn)) {
                            comm = bc.getString(kn);
                            comm = comm.replaceAll("\r", "");
                            String[] split = comm.split("\n");
                            comm = "";
                            for (String s : split) {
                                comm += "#" + s + "\r\n";
                            }
                            break;
                        }
                    }
                }

                if (!comm.isEmpty()) {
                    fin.write(comm.getBytes());
                    fin.write("\r\n".getBytes());
                }
                String v = "";
                for (String v1 : values) {
                    if (v1.equals(kn)) {
                        v = d.getString(kn);
                        break;
                    }
                }
                String p = b.getString(kn) + " = " + v;
                fin.write(p.getBytes());
                fin.write("\r\n\r\n".getBytes());
            }

            fin.flush();
            //try resources used will take care of closing the stream
        }

    }

    public static void printConfig() {
        Iterator<String> i = propertiesConfig.getKeys();
        while (i.hasNext()) {
            String k = i.next();
            System.out.println(k + " = " + propertiesConfig.getProperty(k));
        }
    }

    public static void writeConfig(String filename) throws IOException {
        try {
            PropertiesConfigurationLayout pl = propertiesConfig.getLayout();
            pl.save(new FileWriter(filename));
        } catch (ConfigurationException ex) {
            Logger.getLogger(ServerConfig.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public static void describeConfigAttributes() {
        ResourceBundle b = ResourceBundle.getBundle(resourceConfigAttr);
        Enumeration<String> k = b.getKeys();
        ResourceBundle bc = ResourceBundle.getBundle(resourceConfigComments);
        Set c = bc.keySet();
        String[] comments = new String[c.size()];
        c.toArray(comments);

        while (k.hasMoreElements()) {
            String kn = k.nextElement();
            String comm = "";
            for (String comment : comments) {
                if (comment.equals(kn)) {
                    comm = bc.getString(kn);
                    break;
                }
            }
            System.out.println(b.getString(kn) + " = " + comm + "\n");
        }
    }

}
