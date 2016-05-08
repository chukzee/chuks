/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.Enumeration;
import java.util.jar.JarFile;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.ZipEntry;

/**
 *
 * @author USER
 */
class WebAppClassLoader extends ClassLoader {

    private String classAbsoluteFileName;
    private Bootstrap.ClassFinderListener listener;
    private boolean isBoostrap;

    private WebAppClassLoader() {
    }

    public WebAppClassLoader(ClassLoader classLoader) {
        super(classLoader);
    }

    @Override
    protected String findLibrary(String libname) {
        //COME BACK FOR IMPLEMENTATION
        return super.findLibrary(libname); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    protected URL findResource(String name) {
        //URL url = super.findResource(name);
        return findResourceInJar(name); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    protected Enumeration<URL> findResources(String name) throws IOException {
        Enumeration<URL> en = super.findResources(name);

        return en;
    }

    void flagOnBootstrap() {
        isBoostrap = true;
    }

    void flagOffBootstrap() {
        isBoostrap = false;
    }

    /**
     * Finds the class with the specified name.
     *
     * @param className
     * @return
     * @throws ClassNotFoundException
     */
    @Override
    protected Class<?> findClass(String className) throws ClassNotFoundException {

        FileInputStream fis = null;
        Class<?> cl = null;
        try {

            File f = new File(classAbsoluteFileName);
            if (f.exists()) {
                int size = (int) f.length();
                byte buff[] = new byte[size];
                fis = new FileInputStream(f);
                try (DataInputStream dis = new DataInputStream(fis)) {
                    dis.readFully(buff);
                }
                cl = defineClass(className, buff, 0, buff.length);
            } else {
                //search jars in the directory
                cl = findClassInJar(className);
            }

            if (listener != null && isBoostrap) {
                listener.classFound(className);
            }

            return cl;
        } catch (IOException ex) {
            Logger.getLogger(WebAppClassLoader.class.getName()).log(Level.SEVERE, null, ex);

        } finally {
            try {
                if (fis != null) {
                    fis.close();
                }
            } catch (IOException ex) {
                Logger.getLogger(WebAppClassLoader.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        return super.findClass(className);
    }

    void setClassAbsoluteFileName(String classLoc) {
        this.classAbsoluteFileName = classLoc;
    }

    private Class<?> findClassInJar(String className) throws IOException, ClassNotFoundException {

        File class_path = new File(HttpServerImpl.getClassPath());
        Class<?> cl = findClassInPath(className, class_path);//find in class path
        if (cl == null) {
            File lib_path = new File(HttpServerImpl.getLibraryPath());
            if (lib_path.compareTo(class_path) != 0) {//ok paths are not the same.
                cl = findClassInPath(className, lib_path);//find in library path
            }
        }

        if (cl == null) {//still not found
            return super.findClass(className);//throw ClassNotFoundException
        }

        return cl;
    }

    private Class<?> findClassInPath(String className, File file) throws IOException, ClassNotFoundException {

        File[] files = file.listFiles(new FileFilter() {
            @Override
            public boolean accept(File pathname) {
                return pathname.getPath().endsWith(".jar");
            }
        });

        String classEntry = className.replace('.', '/') + ".class";
        for (File f : files) {
            JarFile jar_file = new JarFile(f);
            ZipEntry entry = jar_file.getEntry(classEntry);
            if (entry == null) {
                continue;
            }
            InputStream in = jar_file.getInputStream(entry);
            byte buff[] = new byte[(int) entry.getSize()];
            try (DataInputStream dis = new DataInputStream(in)) {
                dis.readFully(buff);
            }
            return defineClass(className, buff, 0, buff.length);
        }

        return null;
    }

    private URL findResourceInJar(String name) {

        File class_path = new File(HttpServerImpl.getClassPath());
        URL url = findResourcesInPath(name, class_path);//find in class path
        if (url == null) {
            File lib_path = new File(HttpServerImpl.getLibraryPath());
            if (lib_path.compareTo(class_path) != 0) {//ok paths are not the same.
                url = findResourcesInPath(name, lib_path);//find in library path
            }
        }

        return url;
    }

    private URL findResourcesInPath(String name, File file) {

        File[] files = file.listFiles(new FileFilter() {
            @Override
            public boolean accept(File pathname) {
                return pathname.getPath().endsWith(".jar");
            }
        });

        for (File f : files) {
            JarFile jar_file = null;
            try {
                jar_file = new JarFile(f);
            } catch (IOException ex) {
                Logger.getLogger(WebAppClassLoader.class.getName()).log(Level.SEVERE, null, ex);
            }
            ZipEntry entry = jar_file.getEntry(name);
            if (entry != null) {
                URL url = null;
                try {
                    String jar_file_name = f.getPath().replace(HttpServerImpl.fileSeparator(), '/');
                    String url_path = "jar:file:///" + jar_file_name + ".jar!/" + name;
                    url = new URL(url_path);
                } catch (MalformedURLException ex) {
                    Logger.getLogger(WebAppClassLoader.class.getName()).log(Level.SEVERE, null, ex);
                }
                return url;
            }
        }

        return null;
    }

    void setFinderListener(Bootstrap.ClassFinderListener listener) {
        this.listener = listener;
    }
}
