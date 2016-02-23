/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import static chuks.server.http.impl.SimpleHttpServer.fileSeparator;
import static chuks.server.http.impl.SimpleHttpServer.getClassPath;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectStreamClass;
import java.lang.reflect.Proxy;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class ExtendedObjectInputStream extends ObjectInputStream {

    private final WebAppClassLoader classLoader;

    ExtendedObjectInputStream(InputStream in, WebAppClassLoader classLoader) throws IOException {
        super(in);
        this.classLoader = classLoader;
    }

    /**
     * This method is overridden so as to provide alternative source to find a
     * class to be loaded if not already loaded. Since the server side app class
     * may reside in location where it was not loaded by the bootstrap class
     * loader it will be necessary to dynamically load the class at runtime
     * hence the <code>resolveClass()</code> method of the
     * <code>ObjectInputStream</code> class was overridden.
     *
     * @param desc an instance of class ObjectStreamClass
     * @return a Class object corresponding to desc
     * @throws IOException any of the usual Input/Output exceptions.
     * @throws ClassNotFoundException if class of a serialized object cannot be
     * found.
     */
    @Override
    protected Class<?> resolveClass(ObjectStreamClass desc) throws IOException, ClassNotFoundException {

        String className = desc.getName().replace('.', fileSeparator());
        String classLoc = getClassPath() + fileSeparator() + className;
        classLoader.setClassAbsoluteFileName(classLoc);
        return Class.forName(desc.getName(), false, classLoader);
    }

    @Override
    protected Class resolveProxyClass(final String[] interfaces) throws IOException, ClassNotFoundException {
        final Class[] d_interfaces = new Class[interfaces.length];
        for (int i = 0; i < interfaces.length; i++) {
            String className = interfaces[i].replace('.', fileSeparator());
            String classLoc = getClassPath() + fileSeparator() + className;
            classLoader.setClassAbsoluteFileName(classLoc);
            d_interfaces[i] = Class.forName(interfaces[i], false, classLoader);
        }

        try {
            return Proxy.getProxyClass(classLoader, d_interfaces);
        } catch (IllegalArgumentException e) {
            throw new ClassNotFoundException(null, e);
        }
    }

}
