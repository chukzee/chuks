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
import org.objectweb.asm.*;
import org.objectweb.asm.commons.AdviceAdapter;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class Bootstrap {

    static Bootstrap instance;
    static int MAX_BOOTSTRAP_CLASS_LOADED = 100;//TODO verify value for performance sake
    private static boolean done;
    private static String[] classesFilenames = {};
    static private int loaded;
    static Class webAppInterface = SimpleServerApplication.class;
    
    static ClassFinderListener listener = new ClassFinderListener(){
            @Override
            public void classFound(String className) {
                loaded++;
                System.out.println("Found and loaded : "+className);
            }
        };
    
    static class ClassProbe extends ClassVisitor {

        public ClassProbe(int api) {
            super(api);
        }

        @Override
        public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
            loadRequiredClass0(name, interfaces);
        }

        @Override
        public MethodVisitor visitMethod(int access, String name, String desc, String signature, String[] exceptions) {
            MethodVisitor methodVisitor = new MethodVisitor(this.api) {
            };
            return new MethodProbe(this.api, methodVisitor, access, name, desc);
        }

        @Override
        public FieldVisitor visitField(int access, String name, String desc, String signature, Object value) {
            String cn = convertDescToInternalClassName(desc);
            loadRequiredClass0(cn, null);

            System.out.println(cn);

            return null;
        }

        @Override
        public void visitInnerClass(String name, String outerName, String innerName, int access) {
            loadRequiredClass0(name, null);
        }

        @Override
        public void visitOuterClass(String owner, String name, String desc) {
            loadRequiredClass0(owner, null);
        }
    }

    static class MethodProbe extends AdviceAdapter {

        MethodProbe(int api, MethodVisitor visitor, int access, String name, String desc) {
            super(api, visitor, access, name, desc);
        }

        @Override
        public void visitMethodInsn(int opcode, String owner, String name, String desc, boolean itf) {
            loadRequiredClass0(owner, null);
            super.visitMethodInsn(opcode, owner, name, desc, itf); //To change body of generated methods, choose Tools | Templates.
        }

        @Override
        public void visitTypeInsn(int opcode, String type) {
            //loadRequiredClass0(type, null);
            //System.out.println("---->"+type);
            String cn = convertDescToInternalClassName(type);
            loadRequiredClass0(cn, null);
            super.visitTypeInsn(opcode, type); //To change body of generated methods, choose Tools | Templates.
        }

        @Override
        public void visitMultiANewArrayInsn(String desc, int dims) {
            String cn = convertDescToInternalClassName(desc);
            loadRequiredClass0(cn, null);
            super.visitMultiANewArrayInsn(desc, dims); //To change body of generated methods, choose Tools | Templates.
        }

        @Override
        public void visitTryCatchBlock(Label start, Label end, Label handler, String type) {
            String cn = convertDescToInternalClassName(type);
            loadRequiredClass0(cn, null);
            super.visitTryCatchBlock(start, end, handler, type); //To change body of generated methods, choose Tools | Templates.
        }

        @Override
        public void visitLocalVariable(String name, String desc, String signature, Label start, Label end, int index) {
            String cn = convertDescToInternalClassName(desc);
            loadRequiredClass0(cn, null);
            super.visitLocalVariable(name, desc, signature, start, end, index); //To change body of generated methods, choose Tools | Templates.
        }

    }
    
    public interface ClassFinderListener{
        void classFound(String className);
    }

    private static String convertDescToInternalClassName(String desc) {
        if (desc == null) {
            return null;
        }

        //check if it is primitive type
        if (desc.length() == 1
                && Character.isUpperCase(desc.charAt(0))) {//well, this is a crude way anyway but it works.
            return null;//is primitive so return null
        }

        //check if last character ends with semi-colon
        if (desc.charAt(desc.length() - 1) != ';') {
            return desc;//last character must end with semi-colon
        }
        int begin = 1;
        for (int i = 0; i < desc.length(); i++) {
            if (desc.charAt(i) == '[') {
                begin++;
            } else {
                break;
            }
        }

        String c = null;
        if (desc.length() - begin > 0) {
            c = desc.substring(begin, desc.length() - 1);
        }

        return c;
    }

    void reset() {
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
        ClassProbe visitor = new ClassProbe(Opcodes.ASM5);
        navDir(file, visitor);
    }

    void load(String[] classesFilename) {
        Bootstrap.classesFilenames = classesFilename;
        load();
    }

    private static void navDir(File file, ClassVisitor visitor) {
        File[] files = file.listFiles();
        for (File f : files) {
            if (done) {
                return;
            }
            if (f.isDirectory()) {
                navDir(f, visitor);
            }
            if (f.getPath().endsWith(".jar")) {
                handleJar(f, visitor);
            } else if (f.getPath().endsWith(".class")) {
                handleClassFile(f, visitor);
            }

        }
    }

    static private void loadRequiredClass(ClassReader reader, ClassVisitor visitor) {

        String[] interfaces = reader.getInterfaces();
        if (interfaces != null && interfaces.length > 0) {
            for (String _interface : interfaces) {
                if (_interface.equals(webAppInterface.getName().replace('.', '/'))) {
                    reader.accept(visitor, ClassReader.EXPAND_FRAMES);//visit implementor of SimpleServerApplication
                    return;
                }
            }
        }
    }

    static private boolean loadRequiredClass0(String className, String[] interfaces) {
        if (className == null) {
            return false;
        }
        
        String absoluteClassFile = getClassPath() + className.replace('/', fileSeparator()) + ".class";
        if (interfaces != null && interfaces.length > 0) {
            for (String _interface : interfaces) {
                if (_interface.equals(webAppInterface.getName().replace('.', '/'))) {
                    return doClassLoad(absoluteClassFile, true);//implementor SimpleServerApplication
                }
            }
        } else {
            //System.out.println("non-implementor = "+className);
            return doClassLoad(absoluteClassFile, false);// non-implementor of SimpleServerApplication
        }

        return false;
    }

    private static boolean doClassLoad(String absoluteClassFile, boolean isImplementor) {
       
        
        if (loaded < MAX_BOOTSTRAP_CLASS_LOADED) {
            if (WebAppManager.loadWebApp(listener, absoluteClassFile, isImplementor)) {
                return true;
            }
        } else {
            done = true;
        }

        return false;
    }

    private static void handleJar(File f, ClassVisitor visitor) {
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
                    loadRequiredClass(new ClassReader(in), visitor);
                }
            }

        } catch (IOException ex) {
            Logger.getLogger(Bootstrap.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

    private static void handleClassFile(File f, ClassVisitor visitor) {
        try {
            try (FileInputStream fin = new FileInputStream(f)) {
                loadRequiredClass(new ClassReader(fin), visitor);
            }
        } catch (IOException ex) {
            Logger.getLogger(Bootstrap.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private void loadByNames() {
        for (String classFilename : classesFilenames) {
            WebAppManager.loadWebApp(listener, classFilename, true);           
        }
    }

}
