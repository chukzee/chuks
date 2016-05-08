/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import chuks.server.HttpServerException;
import chuks.server.WebApplication;
import static chuks.server.http.impl.HttpServerImpl.*;
import static chuks.server.http.impl.ServerConfig.*;
import chuks.server.util.ThreadUtil;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import static java.nio.file.LinkOption.NOFOLLOW_LINKS;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import static java.nio.file.StandardWatchEventKinds.ENTRY_CREATE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_DELETE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_MODIFY;
import static java.nio.file.StandardWatchEventKinds.OVERFLOW;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author USER
 */
class WebAppManager implements Runnable {

    /**
     * Hold the initialized web apps (ie classes that implements WebApplication)
     */
    private static Map<String, WebApplication> webAppMap = new HashMap(); //no need for synchronized collection here since the access  is in synchronized block - see implementation below

    /**
     * Hold the Class object of the web apps (ie classes that implements
     * WebApplication) loaded by the Bootstrap class during server start up
     */
    private static Map<String, Class> webAppClassObjectsMap = new HashMap(); //no need for synchronized collection here since the access  is in synchronized block - see implementation below
    //private static String classPath;
    private final static Object c_lock = new Object();
    private static boolean isClassFilesChange;
    private static WebAppClassLoader lastClassLoader;
    private static HttpServerException initException;

    private final WatchService watcher;
    private final Map<WatchKey, Path> keys;
    private boolean trace = false;
    static private WebAppManager webAppManager;
    static private boolean isStarted;

    private WebAppManager() throws IOException {
        this.watcher = FileSystems.getDefault().newWatchService();
        this.keys = new HashMap<>();

    }

    static WebAppManager getInstance() throws IOException {

        if (webAppManager != null) {
            return webAppManager;
        }
        synchronized (c_lock) {
            if (webAppManager == null) {
                return webAppManager = new WebAppManager();
            }
        }
        return webAppManager;
    }

    void start() {
        if (isStarted) {
            return;
        }
        synchronized (c_lock) {
            if (isStarted) {
                return;
            }
            isStarted = true;
        }

        new Thread(webAppManager).start();
    }

    static void stop() {
        isStarted = false;
        webAppManager = null;
    }

    static boolean isStop() {
        return !isStarted;
    }

    static WebApplication getWebApp(String classAbsoluteFilename, RequestValidator requestValidator, ServerObjectImpl serverObj) {

        String className = classAbsoluteFilename.substring(getClassPath().length(), classAbsoluteFilename.length() - SERVER_FILE_EXT.length() - 1);
        className = className.replace(fileSeparator(), '.');//Yes - replace all occurence of OS file seperator with '.' . Yes replace() does replace all the char occurence - see doc 
        WebApplication ssr;
        try {
            synchronized (c_lock) {
                if (!isClassFilesChange) {
                    ssr = webAppMap.get(className);
                    if (ssr != null) {
                        return (WebApplication) ssr.initialize(serverObj);//return fresh copy - that which has not been used.
                    }

                    if (lastClassLoader == null) {
                        lastClassLoader = new WebAppClassLoader(WebAppManager.class.getClassLoader());
                    }
                    ssr = checkFileSystem(className, classAbsoluteFilename, lastClassLoader, requestValidator, serverObj);//ok load from the file system;
                } else {

                    //At this point the class files have changed
                    webAppMap.clear();
                    webAppClassObjectsMap.clear();
                    isClassFilesChange = false;//set to false since we have initialize the class loader anyway.
                    WebAppClassLoader classLoader = new WebAppClassLoader(WebAppManager.class.getClassLoader());
                    ssr = checkFileSystem(className, classAbsoluteFilename, classLoader, requestValidator, serverObj);//ok load from the file system;
                }
            }//end of sync
        } catch (Exception ex) {
            requestValidator.handleReceiverError(ex, null);
            return null;
        }
        if (initException != null) {
            requestValidator.handleReceiverError(initException, null);
        }

        return ssr;
    }

    static private WebApplication checkFileSystem(String className, String classAbsoluteFilename, WebAppClassLoader classLoader, RequestValidator requestValidator, ServerObjectImpl serverObj) {

        //check the cache once more if you were a waiter during lock
        //because we want to try as much as possible
        //to skip the reload of the class and java reflection below which altogether is expensive.
        WebApplication ssr = webAppMap.get(className);//check cache again
        if (ssr != null) {
            try {
                return (WebApplication) ssr.initialize(serverObj);//return fresh copy - that which has not been used.
            } catch (Exception ex) {
                requestValidator.handleReceiverError(ex, null);
                return null;
            }
        }

        //Ok, we've done our best, we've got no choice but to go for the class reload and java reflection.
        //The condition above will try as much as possible to limit execution below this point
        initException = null;
        try {

            Class<?> cl;
            try {
                //well check if the class was loaded by our Bootstrap.class 
                if ((cl = webAppClassObjectsMap.get(className)) == null) {
                    lastClassLoader = classLoader;
                    classLoader.setClassAbsoluteFileName(classAbsoluteFilename);
                    cl = classLoader.loadClass(className); //loadClass is already synchronized in ClassLoader so we are safe

                    /*similaryly use Class.forNam(...). except that Class.forName(...) 
                     *can be used for Class initialization( ie static initializtion) if the
                     *initialize parameter is set to true
                     c = Class.forName(className, false, classLoader);
                     */
                }
            } catch (ClassNotFoundException ex) {
                requestValidator.ensureResourceNotFound(ex);
                return null;
            }

            WebApplication sr = (WebApplication) cl.newInstance();
            //store a fresh copy in the map rather than use reflection next time
            WebApplication freshCopy;
            try {
                freshCopy = (WebApplication) sr.initialize(serverObj); // initialize() should return a fresh copy
                freshCopy.callOnce(serverObj);//called only once for the entire exist of the WebApplication Class
            } catch (Exception ex) {
                requestValidator.handleReceiverError(ex, null);
                return null;
            }
            //check the validity of the copy
            boolean sameClass = freshCopy.getClass().equals(sr.getClass());
            if (!sameClass
                    || freshCopy.equals(sr)) {
                //invalid fresh copy since the class of freshCopy and sr must be the same
                //and the objects must not be equal.
                initException = new HttpServerException("incorrectly initialized " + classAbsoluteFilename + " - expected: new " + sr.getClass().getName() + "()");
                sr.onError(new ServerObjectImpl(), initException);//notify error 
                throw initException;
            }

            webAppMap.put(className, freshCopy);//store the fresh copy

            return sr;//return this instance since we already have a fresh copy for another server app

        } catch (ClassCastException |
                InstantiationException |
                IllegalAccessException | HttpServerException ce) {
            Logger.getLogger(WebAppManager.class.getName()).log(Level.SEVERE, null, ce);
        }

        return null;
    }

    static boolean loadWebApp(Bootstrap.ClassFinderListener listener, String classAbsoluteFilename, boolean isImplementor) {
        String className = classAbsoluteFilename.substring(getClassPath().length(), classAbsoluteFilename.length() - SERVER_FILE_EXT.length() - 1);
        className = className.replace(fileSeparator(), '.');
        synchronized (c_lock) {
            try {
                if (webAppClassObjectsMap.get(className) != null
                        || webAppMap.get(className) != null) {
                    return false;//already loaded
                }

                //load it
                if (lastClassLoader == null) {
                    lastClassLoader = new WebAppClassLoader(WebAppManager.class.getClassLoader());
                }
                lastClassLoader.setClassAbsoluteFileName(classAbsoluteFilename);
                lastClassLoader.setFinderListener(listener);
                lastClassLoader.flagOnBootstrap();
                Class<?> cl = lastClassLoader.loadClass(className);
                lastClassLoader.flagOffBootstrap();
                if (isImplementor) {
                    webAppClassObjectsMap.put(className, cl);
                }
                //cl.newInstance();//Testing
                //Logger.getLogger(WebAppManager.class.getName()).log(Level.INFO, "Loaded : {0}" + "." + SERVER_FILE_EXT, className);
                //System.out.println("Loaded : "+className + "." + SERVER_FILE_EXT);
                return true;
            } catch (Exception ex) {
                Logger.getLogger(WebAppManager.class.getName()).log(Level.SEVERE, null, ex);
            }
            return false;
        }
    }

    @SuppressWarnings("unchecked")
    static <T> WatchEvent<T> cast(WatchEvent<?> event) {
        return (WatchEvent<T>) event;
    }

    /**
     * Register the given directory with the WatchService
     */
    private void register(Path dir) throws IOException {
        WatchKey key = dir.register(watcher, ENTRY_CREATE, ENTRY_DELETE, ENTRY_MODIFY);
        if (trace) {
            Path prev = keys.get(key);
            if (prev == null) {
                System.out.format("register: %s\n", dir);
            } else {
                if (!dir.equals(prev)) {
                    System.out.format("update: %s -> %s\n", prev, dir);
                }
            }
        }
        keys.put(key, dir);
    }

    /**
     * Register the given directory, and all its sub-directories, with the
     * WatchService.
     */
    private void registerAll(final Path start1, final Path start2) throws IOException {
        // register directory and sub-directories
        if (start1 != null) {
            Files.walkFileTree(start1, new SimpleFileVisitor<Path>() {
                @Override
                public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs)
                        throws IOException {
                    register(dir);
                    return FileVisitResult.CONTINUE;
                }
            });
        }

        if (start2 != null) {
            Files.walkFileTree(start2, new SimpleFileVisitor<Path>() {
                @Override
                public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs)
                        throws IOException {
                    register(dir);
                    return FileVisitResult.CONTINUE;
                }
            });
        }
    }
    int count = 0;

    /**
     * Process all events for keys queued to the watcher
     */
    void processFileChangeEvents() {
        for (;;) {

            // wait for key to be signalled
            WatchKey key;
            try {
                key = watcher.take();
            } catch (InterruptedException x) {
                Logger.getLogger(WebAppManager.class.getName()).log(Level.SEVERE, null, x);
                return;
            }

            Path dir = keys.get(key);
            if (dir == null) {
                System.err.println("WatchKey not recognized!!");
                continue;
            }

            for (WatchEvent<?> event : key.pollEvents()) {
                WatchEvent.Kind kind = event.kind();

                // TBD - provide example of how OVERFLOW event is handled
                if (kind == OVERFLOW) {
                    continue;
                }

                // Context for directory entry event is the file name of entry
                WatchEvent<Path> ev = cast(event);
                Path name = ev.context();
                Path child = dir.resolve(name);

                // print out event
                // System.out.format("%s: %s\n", event.kind().name(), child);
                if (kind == ENTRY_MODIFY || kind == ENTRY_DELETE) {
                    System.out.println(count++ + "   " + dir);//testing

                    synchronized (c_lock) {
                        isClassFilesChange = true; //flag file change for the next waiting thread to create new class loader
                    }

                    String file_path = child.toString();
                    if (ServerCache.LRUOptimalCache.containsKey(file_path)) {
                        ServerCache.LRUOptimalCache.remove(file_path);
                    }

                    if (child.getParent().equals(getPathClassPath())) {
                        //Whenever any file in the class path is modified the index file in the cache must be remove.
                        //since the default index file extension configuration settings might change at runtime, it
                        //we be safer to remove the index file from cache with every modification of class path files.

                        //remove any index file 
                        if (file_path.endsWith(fileSeparator() + "index.html")) {
                            ServerCache.LRUOptimalCache.remove(file_path);
                        }

                        if (file_path.endsWith(fileSeparator() + "index." + DEFAULT_INDEX_FILE_EXTENSION)) {
                            ServerCache.LRUOptimalCache.remove(file_path);
                        }

                        if (file_path.endsWith(fileSeparator() + "index")) {
                            ServerCache.LRUOptimalCache.remove(file_path);
                        }
                    }
                }

                // if directory is created, and watching recursively, then
                // register it and its sub-directories
                if (kind == ENTRY_CREATE) {
                    try {
                        if (Files.isDirectory(child, NOFOLLOW_LINKS)) {
                            registerAll(child, null);
                        }
                    } catch (IOException x) {
                        // ignore to keep sample readbale
                        Logger.getLogger(WebAppManager.class.getName()).log(Level.SEVERE, null, x);
                    }
                }
            }

            // reset key and remove from set if directory no longer accessible
            boolean valid = key.reset();
            if (!valid) {
                keys.remove(key);

                // all directories are inaccessible
                if (keys.isEmpty()) {
                    System.err.println("All directories are not accessible");
                    break;
                }
            }

            //waitForSomeTime();//we don't want too much rate of detection to avoid too many class loader create during say a case of copying directory in this class path 
        }
    }

    @Override
    public void run() {

        Path dirPath1 = Paths.get(HttpServerImpl.getClassPath());
        Path dirPath2 = Paths.get(HttpServerImpl.getWebRoot());

        if (!dirPath1.toFile().exists()) {
            dirPath1 = null;
        }

        if (!dirPath2.toFile().exists()) {
            dirPath2 = null;
        }
        if (dirPath1 != null || dirPath2 != null) {

            outer:
            while (!HttpServerImpl.isStop() || !WebAppManager.isStop()) {
                try {
                    System.out.format("INFO: Scanning %s ...\n", HttpServerImpl.getClassPath());
                    if (dirPath1 != null && !dirPath1.equals(dirPath2)) {
                        System.out.format("INFO: Scanning %s ...\n", HttpServerImpl.getWebRoot());
                    }

                    registerAll(dirPath1, dirPath2);

                    System.out.println("INFO: finished scanning...");

                    // enable trace after initial registration
                    this.trace = true;

                    this.processFileChangeEvents();

                    for (int i = 0; i < 2000; i++) {
                        if (HttpServerImpl.isStop() || WebAppManager.isStop()) {
                            break outer;
                        }
                        Thread.sleep(1); // yes 1 (one) not i (letter i)
                    }

                } catch (IOException ex) {
                    Logger.getLogger(WebAppManager.class.getName()).log(Level.SEVERE, null, ex);
                } catch (Exception ex) {
                    Logger.getLogger(WebAppManager.class.getName()).log(Level.SEVERE, null, ex);
                }

            }
        } else {
            System.out.println("Watch Service Path Set.");
        }
        System.out.println("Receiver Watch Service Ends.");
    }

    private void waitForSomeTime() {
        ThreadUtil.sleep(3000);
    }

}
