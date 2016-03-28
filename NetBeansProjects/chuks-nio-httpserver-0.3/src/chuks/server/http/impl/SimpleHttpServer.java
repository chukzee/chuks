    /*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import chuks.server.HttpServer;
import chuks.server.SimpleHttpServerException;
import chuks.server.SimpleServerConfigException;
import chuks.server.cache.config.CacheProperties;
import static chuks.server.http.impl.ServerCache.DEFAULT_REGION_NAME;
import chuks.server.http.loadbalance.LoadBalanceStrategy;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.net.*;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.*;
import java.util.logging.*;
import javax.net.ServerSocketFactory;
import java.util.ResourceBundle;
import java.util.Set;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.commons.configuration.PropertiesConfigurationLayout;

/**
 *
 * @author ogaga
 */
public class SimpleHttpServer implements HttpServer {

    private static char FileSeparator = '\\';//but will be set automatically based on the OS anyway
    static int cache_port;
    static SocketAddress cacheSockAddress;

    static String host;
    static private int port;
    private static Path pathWebRoot;
    private static Path pathClassPath;
    private static String cache_host_ip;
    private static LoadBalanceStrategy loadBalanceStrategy;

    public static SocketAddress getCacheSockAddress() {
        return cacheSockAddress;
    }

    static private String root_dir;
    static String classPath;
    static String libraryPath;
    static private String disguised_server_code_file_ext = ServerConfig.SERVER_FILE_EXT;
    static private boolean enableErrorOuput;
    static private boolean isWindows;
    static private boolean enableRemoteCache;

    static LoadBalanceStrategy getLoadBalanceStrategy() {
        return loadBalanceStrategy;
    }
    
    private String configFileSaved;

    static {

        // First we load the underlying JDBC driver.
        // You need this if you don't use the jdbc.drivers
        // system property.
        System.out.println("INFO: Loading underlying JDBC driver.");
        try {
            //Class.forName("org.h2.Driver");
            Class.forName("java.sql.Driver");
            //Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            Logger.getLogger(SimpleHttpServer.class.getName()).log(Level.SEVERE, null, e);
        }
        System.out.println("INFO: Done loading JDBC driver.");

    }

    private SimpleHttpServer(ServerBuilder builder) {
        host = builder.host;
        port = builder.port;
        cache_port = builder.cache_port;
        root_dir = builder.root_dir;
        classPath = builder.classPath;
        libraryPath = builder.libraryPath;
        disguised_server_code_file_ext = builder.disguised_server_code_file_ext;
        enableErrorOuput = builder.enableErrorOutput;
        enableRemoteCache = builder.enableRemoteCache;
        configFileSaved = builder.configFileSaved;

        ServerConfig.propertiesConfig = builder.pConfig;

        cacheSockAddress = new InetSocketAddress(host, cache_port);

        if (libraryPath == null || libraryPath.isEmpty()) {
            libraryPath = classPath;
        }

    }

    static int getCachePort() {
        return cache_port;
    }

    public static boolean isErrorOutputEnabled() {
        return enableErrorOuput;
    }

    public static boolean isRemoteCacheEnabled() {
        return enableRemoteCache;
    }

    public static String getDiguisedExtension() {
        return disguised_server_code_file_ext;
    }

    public static String getWebRoot() {
        return root_dir;
    }

    public static Path getPathWebRoot() {
        return pathWebRoot;
    }

    public static String getClassPath() {
        return classPath;
    }

    public static Path getPathClassPath() {
        return pathClassPath;
    }

    public static String getLibraryPath() {
        return libraryPath;
    }

    public static boolean isWindows() {
        return isWindows;
    }

    static char fileSeparator() {
        return FileSeparator;
    }

    public static String getHost() {
        return host;
    }

    public static int getPort() {
        return port;
    }

    public static String getStrCacheSockAddr() {

        try {
            if (cache_host_ip == null) {
                cache_host_ip = InetAddress.getByName(host).getHostAddress();
            }
        } catch (UnknownHostException ex) {
        }
        return cache_host_ip + ":" + cache_port;
    }

    private SimpleHttpServer() {
    }

    @Override
    public boolean start() {
        try {
            if (ServerHandler.isRunning) {
                throw new SimpleHttpServerException("another instance of this server is already running!");
            }

            checkConfig();
            ServerHandler.isRunning = true;
            ServerHandler.getInstance().start();
            EventPacketHandler.getInstance().start();
            WebAppManager.getInstance().start();
            Bootstrap.getInstance().load();

            if (enableRemoteCache) {
                TCPCacheTransport cTran = TCPCacheTransport.getInstance();
                cTran.start();
            }

            return true;
        } catch (SimpleServerConfigException | SimpleHttpServerException | IOException ex) {
            Logger.getLogger(SimpleHttpServer.class.getName()).log(Level.SEVERE, null, ex);
        }

        ServerHandler.isRunning = false;
        return false;
    }

    @Override
    public boolean stop() {
        finalizeOperation();
        ServerHandler.isRunning = false;
        //COME BACK FOR BETTER AND MORE COMPREHENSIVE CLEAN UP
        return true;
    }

    public static boolean isStop() {
        return !ServerHandler.isRunning;
    }

    @Override
    public boolean isRunning() {
        return ServerHandler.isRunning;
    }

    private void finalizeOperation() {
        //save the load web app class names

    }

    private void checkConfig() throws SimpleServerConfigException {

        if (classPath == null || classPath.isEmpty()) {
            throw new SimpleServerConfigException("invalid class path - null or empty");
        }

        if (root_dir == null || root_dir.isEmpty()) {
            throw new SimpleServerConfigException("invalid root dir - null or empty");
        }

        if (new File(classPath).compareTo(new File(root_dir)) <= 0) {
            throw new SimpleServerConfigException("invalid class path - class path must be sub directory of web root");
        }

        //REMIND: THE CONFIGURATION SETUP WIL INCLUDE MAIN SERVER PATH AND ADDITION LIB PATH 
        if (libraryPath != null) {

            if (new File(libraryPath).compareTo(new File(classPath)) < 0) {
                throw new SimpleServerConfigException("invalid library path - library path must be same or sub directory of classpath");
            }
        }

        pathWebRoot = Paths.get(root_dir);
        pathClassPath = Paths.get(classPath);

        if (ServerConfig.remoteCacheAddresses.length > 0) {
            validateCacheSocketAddresses();
        }

        FileSeparator = File.separatorChar;

        //ensure the path ends with the file separator
        String os_name = System.getProperty("os.name").toLowerCase();
        if (os_name.startsWith("win")) {
            classPath = classPath.replace('/', '\\');//using default file separator - important
            libraryPath = libraryPath.replace('/', '\\');//using default file separator - important
            root_dir = root_dir.replace('/', '\\');//using default file separator - important
            isWindows = true;
        }

        if (!classPath.endsWith(File.separator)) {
            classPath = classPath + File.separator;//end it with the file separator
        }

        if (!libraryPath.endsWith(File.separator)) {
            libraryPath = libraryPath + File.separator;//end it with the file separator
        }

        if (!root_dir.endsWith(File.separator)) {
            root_dir = root_dir + File.separator;//end it with the file separator
        }

        //more config validation goes below
    }

    private void validateCacheSocketAddresses() throws SimpleServerConfigException {

        try {
            cache_host_ip = InetAddress.getByName(host).getHostAddress();
        } catch (UnknownHostException ex) {
            throw new SimpleServerConfigException(ex.getMessage());
        }

        if (cache_port == port) {
            throw new SimpleServerConfigException("invalid cache port number (" + cache_port + ") - must not be same as that used by the server to listen for request");
        }
        try {
            ServerConfig.remoteCacheAddresses = ServerUtil.validateCacheAdresses(ServerConfig.remoteCacheAddresses);
        } catch (SimpleHttpServerException ex) {
            throw new SimpleServerConfigException(ex.getMessage());
        }

        int cancelled = 0;
        for (int i = 0; i < ServerConfig.remoteCacheAddresses.length; i++) {
            String[] split = ServerConfig.remoteCacheAddresses[i].split(":");
            String rmt_host = split[0];
            String rmt_port = split[1];//already validated - so we are pretty sure it is numeric
            try {
                if (InetAddress.getByName(rmt_host).equals(InetAddress.getByName(host))) {
                    if (Integer.parseInt(rmt_port) == cache_port) {
                        String rmt_addr = ServerConfig.remoteCacheAddresses[i];
                        ServerConfig.remoteCacheAddresses[i] = null;//remove 
                        cancelled++;
                        //log remove 
                        String warning = "A remote cache address (" + rmt_addr + ") was found to be same as that used by this server and then removed!\nRetaining it in the list is pointless.";
                        Logger.getLogger(SimpleHttpServer.class.getName()).log(Level.WARNING, warning);
                    }
                } else {
                    if (Integer.parseInt(rmt_port) != cache_port) {
                        throw new SimpleServerConfigException("invalid remote cache port number detected - remote cache port number must be same as cache port used by this server expect in the case where the specified remote hostname is same as that of this server.");
                    }
                }
            } catch (UnknownHostException ex) {
                throw new SimpleServerConfigException(ex.getMessage());
            }
        }

        String[] arr = new String[ServerConfig.remoteCacheAddresses.length - cancelled];
        int index = -1;
        for (String remoteCacheAddress : ServerConfig.remoteCacheAddresses) {
            if (remoteCacheAddress == null) {
                //System.out.println("Now removed");
                continue;
            }
            index++;
            arr[index] = remoteCacheAddress;
        }

        ServerConfig.remoteCacheAddresses = arr;
        String key = ServerConfig.getConfigAttrBundle().getString(Attr.CacheServers.name());
        ServerConfig.propertiesConfig.setProperty(key, ServerConfig.remoteCacheAddresses);
        if (configFileSaved != null) {
            //rewrite
            try {
                ServerConfig.propertiesConfig.getLayout().save(new FileWriter(configFileSaved));
            } catch (IOException | ConfigurationException ex) {
                throw new SimpleServerConfigException(ex.getMessage());
            }
        }
    }

    public static class ServerBuilder {

        private String host;
        private int port;
        private String root_dir;
        private String classPath;
        private String disguised_server_code_file_ext;
        private boolean enableErrorOutput;
        private String libraryPath;
        private boolean enableRemoteCache;
        private PropertiesConfiguration pConfig = new PropertiesConfiguration();
        PropertiesConfigurationLayout pConfigLayout = new PropertiesConfigurationLayout(pConfig);
        ResourceBundle configAttrBundle = ServerConfig.getConfigAttrBundle();
        ResourceBundle configCommentsBundle = ServerConfig.getConfigCommentsBundle();

        private String configFileToSave;
        private boolean overwriteConfigFile;
        private int cache_port;
        private String configFileSaved;

        public ServerBuilder setBind(String host) {

            this.host = host;
            String key = configAttrBundle.getString(Attr.ServerHost.name());
            pConfigLayout.setComment(key, configCommentsBundle.getString(Attr.ServerHost.name()));
            pConfig.setProperty(key, host);
            return this;
        }

        public ServerBuilder setPort(int port) {
            this.port = port;
            String key = configAttrBundle.getString(Attr.ServerPort.name());
            pConfigLayout.setComment(key, configCommentsBundle.getString(Attr.ServerPort.name()));
            pConfig.setProperty(key, port);
            return this;
        }

        public ServerBuilder setCachePort(int cache_port) {
            this.cache_port = cache_port;
            String key = configAttrBundle.getString(Attr.CachePort.name());
            pConfigLayout.setComment(key, configCommentsBundle.getString(Attr.CachePort.name()));
            pConfig.setProperty(key, cache_port);
            return this;
        }

        public ServerBuilder setWebRoot(String root_dir) {
            this.root_dir = root_dir;
            String key = configAttrBundle.getString(Attr.WebRoot.name());
            pConfigLayout.setComment(key, configCommentsBundle.getString(Attr.WebRoot.name()));
            pConfig.setProperty(key, root_dir);
            return this;
        }

        public ServerBuilder setClassPath(String class_path) {
            this.classPath = class_path;
            String key = configAttrBundle.getString(Attr.ClassPath.name());
            pConfigLayout.setComment(key, configCommentsBundle.getString(Attr.ClassPath.name()));
            pConfig.setProperty(key, class_path);
            return this;
        }

        public ServerBuilder setLibraryPath(String library_path) {
            this.libraryPath = library_path;
            String key = configAttrBundle.getString(Attr.LibraryPath.name());
            pConfigLayout.setComment(key, configCommentsBundle.getString(Attr.LibraryPath.name()));
            pConfig.setProperty(key, library_path);
            return this;
        }

        public ServerBuilder setCacheServersAddresses(String[] remoteCacheAddresses) {

            enableRemoteCache = true;

            if (remoteCacheAddresses == null || remoteCacheAddresses.length == 0) {
                remoteCacheAddresses = new String[0];
                enableRemoteCache = false;
            }

            boolean found = false;
            for (String r : remoteCacheAddresses) {
                if (!r.isEmpty()) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                remoteCacheAddresses = new String[0];
                enableRemoteCache = false;
            }

            ServerConfig.remoteCacheAddresses = remoteCacheAddresses;

            String key1 = configAttrBundle.getString(Attr.EnableRemoteCache.name());
            String key2 = configAttrBundle.getString(Attr.CacheServers.name());

            pConfigLayout.setComment(key1, configCommentsBundle.getString(Attr.EnableRemoteCache.name()));
            pConfig.setProperty(key1, enableRemoteCache);

            pConfigLayout.setComment(key2, configCommentsBundle.getString(Attr.CacheServers.name()));
            pConfig.setProperty(key2, remoteCacheAddresses);
            return this;
        }

        /**
         * if set to true then a string representation of the stack trace of any
         * exception thrown will be sent to the client. The default is false
         * where nothing is sent if an error occurs. This method is intended for
         * debugging purposes.
         *
         * @param enableErrorOuput if true, stack trace of exceptions thrown
         * will be sent to client.
         * @return
         */
        public ServerBuilder setEnableErrorOutput(boolean enableErrorOuput) {
            this.enableErrorOutput = enableErrorOuput;
            String key = configAttrBundle.getString(Attr.EnableErrorOutput.name());
            pConfigLayout.setComment(key, configCommentsBundle.getString(Attr.EnableErrorOutput.name()));
            pConfig.setProperty(key, enableErrorOuput);
            return this;
        }

        /**
         * Used to hide or disguise the extension of the server code file. Any
         * resource with this <code>disguised_ext</code> extension will be
         * treated as the main server extension which is 'class' represent java
         * class file.<br>
         * Setting empty string or null is valid, it simply hides the extension.
         * <p>
         * NOTE: Care must be taken to avoid setting extension of known or
         * popular web resources e.g png , jpg e.t.c as that may cause serious
         * problem during production.
         *
         *
         * @param disguised_ext
         * @return
         */
        public ServerBuilder setDisguisedExtension(String disguised_ext) {
            if (disguised_ext == null) {
                disguised_ext = "";
            }
            this.disguised_server_code_file_ext = disguised_ext;
            String key = configAttrBundle.getString(Attr.ExtensionDisguise.name());
            pConfigLayout.setComment(key, configCommentsBundle.getString(Attr.ExtensionDisguise.name()));
            pConfig.setProperty(key, disguised_ext);
            return this;
        }

        public ServerBuilder setSaveConfigToFile(String configFileToSave, boolean overwriteConfigFile) {
            this.configFileToSave = configFileToSave;
            this.overwriteConfigFile = overwriteConfigFile;
            return this;
        }

        public HttpServer build() throws SimpleServerConfigException {

            pConfigLayout.setHeaderComment(configCommentsBundle.getString(Attr.Header.name()));
            //pConfigLayout.setLineSeparator("\r\n\r\n");            
            pConfig.setLayout(pConfigLayout);//important
            Set<String> keys = pConfigLayout.getKeys();
            Iterator<String> i = keys.iterator();
            while (i.hasNext()) {
                pConfigLayout.setBlancLinesBefore(i.next(), 1);
            }

            if (configFileToSave != null && !configFileToSave.trim().isEmpty()) {
                String ext = "properties";
                int index = configFileToSave.indexOf('.');
                if (index == -1) {
                    configFileToSave += "." + ext;
                } else if (ServerUtil.getFileType(configFileToSave).equals(ext)) {
                    throw new SimpleServerConfigException("invalid configuration file type - expected property file e.g someName.properties");
                }

                File f = new File(configFileToSave);
                boolean allowFileReplace = true;
                if (f.exists()) {
                    allowFileReplace = overwriteConfigFile;
                }

                if (allowFileReplace) {
                    try {
                        pConfig.save(f);
                        configFileSaved = f.getPath();
                    } catch (ConfigurationException ex) {
                        throw new SimpleServerConfigException(ex.getMessage());
                    }
                }
            }

            return new SimpleHttpServer(this);
        }

        public HttpServer buildUsingConfig(Properties properties) {

            /*String type = ServerUtil.getFileType(config_file);
             if (type.isEmpty()) {
             config_file += ".properties";
             } else if (!type.equals("properties")) {
             throw new SimpleServerConfigException("invalid configuration file type - expected property file");
             }*/
                //pConfig = new PropertiesConfiguration(config_file);
            pConfig = new PropertiesConfiguration();
            Set<Map.Entry<Object, Object>> en = properties.entrySet();
            for (Map.Entry<Object, Object> entry : en) {
                pConfig.setProperty((String) entry.getKey(), entry.getValue());
            }

            ServerConfigListener serverConfigListener = new ServerConfigListener();
            pConfig.addConfigurationListener(serverConfigListener);
            pConfig.addErrorListener(serverConfigListener);

            String key;

            key = configAttrBundle.getString(Attr.ServerHost.name());
            if (pConfig.containsKey(key)) {
                host = pConfig.getString(key);
            }

            key = configAttrBundle.getString(Attr.ServerPort.name());
            if (pConfig.containsKey(key)) {
                port = pConfig.getInt(key);
            }

            key = configAttrBundle.getString(Attr.CachePort.name());
            if (pConfig.containsKey(key)) {
                cache_port = pConfig.getInt(key);
            }

            key = configAttrBundle.getString(Attr.WebRoot.name());
            if (pConfig.containsKey(key)) {
                root_dir = pConfig.getString(key);
            }

            key = configAttrBundle.getString(Attr.ClassPath.name());
            if (pConfig.containsKey(key)) {
                classPath = pConfig.getString(key);
            }

            key = configAttrBundle.getString(Attr.LibraryPath.name());
            if (pConfig.containsKey(key)) {
                libraryPath = pConfig.getString(key);
            }

            key = configAttrBundle.getString(Attr.EnableErrorOutput.name());
            if (pConfig.containsKey(key)) {
                enableErrorOutput = pConfig.getBoolean(key);
            }

            key = configAttrBundle.getString(Attr.EnableRemoteCache.name());
            if (pConfig.containsKey(key)) {
                enableRemoteCache = pConfig.getBoolean(key);
            }

            key = configAttrBundle.getString(Attr.ExtensionDisguise.name());
            if (pConfig.containsKey(key)) {
                disguised_server_code_file_ext = pConfig.getString(key);
            }

            key = configAttrBundle.getString(Attr.MaxRemoteCacheHandlerThreads.name());
            if (pConfig.containsKey(key)) {
                ServerConfig.MAX_REMOTE_CACHE_HANDLER_THREADS = pConfig.getInt(key);
            }

            key = configAttrBundle.getString(Attr.MaxSendRemoteCacheTrials.name());
            if (pConfig.containsKey(key)) {
                ServerConfig.MAX_CACHE_SEND_TRIALS = pConfig.getInt(key);
            }

            key = configAttrBundle.getString(Attr.MaxMemoryCacheIdleTime.name());
            if (pConfig.containsKey(key)) {
                ServerConfig.MAX_MEMORY_CACHE_IDLE_TIME = pConfig.getInt(key);
            }

            key = configAttrBundle.getString(Attr.MaxReqestCacheFileSize.name());
            if (pConfig.containsKey(key)) {
                ServerConfig.MAX_REQUEST_CACHE_FILE_SIZE = pConfig.getInt(key);
            }

            key = configAttrBundle.getString(Attr.CacheServers.name());
            if (pConfig.containsKey(key)) {
                ServerConfig.remoteCacheAddresses = pConfig.getStringArray(key);
            }

            key = configAttrBundle.getString(Attr.DefaultIndexFileExtension.name());
            if (pConfig.containsKey(key)) {
                ServerConfig.DEFAULT_INDEX_FILE_EXTENSION = pConfig.getString(key);
            }

            /*
             *Set the default basic cache properties
             */
            CacheProperties cacheProp = new CacheProperties();

            cacheProp.setCacheRegionName(DEFAULT_REGION_NAME);

            cacheProp.setDistributedCache(this.enableRemoteCache);

            key = configAttrBundle.getString(Attr.IsCacheEternal.name());
            if (pConfig.containsKey(key)) {
                cacheProp.setEternal(pConfig.getBoolean(key));
            }

            key = configAttrBundle.getString(Attr.MaxCachedObjects.name());
            if (pConfig.containsKey(key)) {
                cacheProp.setMaxCacheObjects(pConfig.getInt(key));
            }

            key = configAttrBundle.getString(Attr.MaxMemoryCacheIdleTime.name());
            if (pConfig.containsKey(key)) {
                cacheProp.setMaxMemoryIdleTimeInSeconds(pConfig.getLong(key));
            }

            key = configAttrBundle.getString(Attr.MaxCacheSpoolPerRun.name());
            if (pConfig.containsKey(key)) {
                cacheProp.setMaxSpoolPerRun(pConfig.getInt(key));
            }

            key = configAttrBundle.getString(Attr.MemoryCacheShrinkerInterval.name());
            if (pConfig.containsKey(key)) {
                cacheProp.setShrinkerIntervalInSeconds(pConfig.getLong(key));
            }

            key = configAttrBundle.getString(Attr.CacheSpoolChunkSize.name());
            if (pConfig.containsKey(key)) {
                cacheProp.setSpoolChunkSize(pConfig.getInt(key));
            }

            key = configAttrBundle.getString(Attr.CacheTimeToLive.name());
            if (pConfig.containsKey(key)) {
                cacheProp.setTimeToLiveInSeconds(pConfig.getLong(key));
            }

            key = configAttrBundle.getString(Attr.UseMemoryCacheShrinker.name());
            if (pConfig.containsKey(key)) {
                cacheProp.setUseMemoryShrinker(pConfig.getBoolean(key));
            }

            /*
             *Set the default auxiliary cache properties
             */
            
            key = configAttrBundle.getString(Attr.UseDiskCache.name());
            if (pConfig.containsKey(key)) {
                cacheProp.setUseDiskCache(pConfig.getBoolean(key));
            }
            
            key = configAttrBundle.getString(Attr.CacheDiskPath.name());
            if (pConfig.containsKey(key)) {
                cacheProp.setDiskPath(pConfig.getString(key));
            }
            
            key = configAttrBundle.getString(Attr.ClearDiskCacheOnStartup.name());
            if (pConfig.containsKey(key)) {
                cacheProp.setClearDiskCacheOnStartup(pConfig.getBoolean(key));
            }
            
            key = configAttrBundle.getString(Attr.ShutdownSpoolTimeLimit.name());
            if (pConfig.containsKey(key)) {
                cacheProp.setShutdownSpoolTimeLimit(pConfig.getLong(key));
            }
            
            key = configAttrBundle.getString(Attr.DiskCacheOptimizeOnShutdown.name());
            if (pConfig.containsKey(key)) {
                cacheProp.setDiskOptimizeOnShutdown(pConfig.getBoolean(key));
            }
            
            key = configAttrBundle.getString(Attr.DiskCacheMaxRecyleBinSize.name());
            if (pConfig.containsKey(key)) {
                cacheProp.setDiskMaxRecyleBinSize(pConfig.getInt(key));
            }
            
            key = configAttrBundle.getString(Attr.DiskCacheMaxKeySize.name());
            if (pConfig.containsKey(key)) {
                cacheProp.setDiskMaxKeySize(pConfig.getInt(key));
            }
            
            key = configAttrBundle.getString(Attr.DiskCacheMaxPurgatorySize.name());
            if (pConfig.containsKey(key)) {
                cacheProp.setDiskMaxPurgatorySize(pConfig.getInt(key));
            }
            
            key = configAttrBundle.getString(Attr.DiskCacheOptimizeAtRemoveCount.name());
            if (pConfig.containsKey(key)) {
                cacheProp.setDiskOptimizeAtRemoveCount(pConfig.getInt(key));
            }

            ServerCache.createDefaultRegion(cacheProp);

            return new SimpleHttpServer(this);
        }

        public HttpServer buildUsingConfig(String config_file) throws SimpleServerConfigException, IOException {

            String type = ServerUtil.getFileType(config_file);
            if (type.isEmpty()) {
                config_file += ".properties";
            } else if (!type.equals("properties")) {
                throw new SimpleServerConfigException("invalid configuration file type - expected property file");
            }

            Properties properties = new Properties();
            try (FileInputStream fin = new FileInputStream(config_file)) {
                properties.load(fin);
            }

            return buildUsingConfig(properties);
        }

    }

}
