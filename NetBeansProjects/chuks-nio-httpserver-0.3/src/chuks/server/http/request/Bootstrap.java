/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.request;

import chuks.server.SimpleServerApplication;
import static chuks.server.http.request.SimpleHttpServer.*;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Enumeration;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.ZipEntry;
import org.objectweb.asm.ClassReader;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class Bootstrap {

    static Bootstrap instance;
    static int MAX_BOOTSTRAP_CLASS_LOADED = 100;//TODO verify value for performance sake
    private static boolean done;
    private static String[]classesFilenames={};
    static private int loaded;
    
    void init(){
        done = false;
        loaded = 0;
    }
    
    static Bootstrap getInstance() throws IOException {
        if (instance != null) {
            return instance;
        }
        synchronized (Bootstrap.class) {
            if (instance == null) {
                return instance = new Bootstrap();
            }
        }
        return instance;
    }
    
    void load() {
        loadByNames();
        File file = new File(SimpleHttpServer.getClassPath());
        navDir(file);
    }
    
    void load(String[] classesFilename) {
        Bootstrap.classesFilenames = classesFilename;
        load();
    }
    
    private static void navDir(File file) {
        File[] files = file.listFiles();
        for (File f : files) {
            if(done){
                return;
            }
            if (f.isDirectory()) {
                navDir(f);
            }
            if (f.getPath().endsWith(".jar")) {
                handleJar(f);
            } else if (f.getPath().endsWith(".class")) {
                handleClassFile(f);
            }

        }
    }

    static private void loadRequiredClass(ClassReader reader) {
        String[] interfaces = reader.getInterfaces();//implemented interfaces
        for (String _interface : interfaces) {
            if (_interface.equals(SimpleServerApplication.class.getName().replace('.', '/')))
            {
                if (loaded < MAX_BOOTSTRAP_CLASS_LOADED) {
                    String classFile = getClassPath()+reader.getClassName().replace('/', fileSeparator())+".class";
                    if(WebAppManager.loadWebApp(classFile)){
                        loaded++;
                    }
                }else{
                    done = true;
                }
                break;
            }
        }
    }

    private static void handleJar(File f) {
        try {
            JarFile jar_file = new JarFile(f);
            Enumeration<JarEntry> e = jar_file.entries();
            while (e.hasMoreElements()) {
                JarEntry je = e.nextElement();
                ZipEntry entry = jar_file.getEntry(je.getName());
                if (entry.isDirectory()) {
                    continue;
                }
                if (!entry.getName().endsWith(".class")) {
                    continue;
                }
                try (InputStream in = jar_file.getInputStream(entry)) {
                    loadRequiredClass(new ClassReader(in));
                }
            }

        } catch (IOException ex) {
            Logger.getLogger(Bootstrap.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

    private static void handleClassFile(File f) {
        try {
            try (FileInputStream fin = new FileInputStream(f)) {
                loadRequiredClass(new ClassReader(fin));
            }
        } catch (IOException ex) {
            Logger.getLogger(Bootstrap.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private void loadByNames() {
        for(String classFilename: classesFilenames){
            if(WebAppManager.loadWebApp(classFilename)){
                loaded++;
            }
        }
    }

}
