/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import java.util.zip.ZipEntry;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class TestLoader {

    public static void main(String... args) throws IOException {
        JarFile jar_file = new JarFile("C:\\Users\\USER\\Documents\\NetBeansProjects\\APPIncidenceReport\\dist\\APPIncidenceReport.jar");
        ZipEntry e = jar_file.getEntry("report/ReportJSON.class");
        byte[] b = new byte[(int) e.getSize()];

        jar_file.getInputStream(e).read(b);
        //System.out.println(new String(b));
        File f1 = new File("C:\\Users\\USER\\Documents\\NetBeansProjects\\APPIncidenceReport\\dist\\");
        File f2 = new File("C:\\Users\\USER\\Documents\\NetBeansProjects\\APPIncidenceReport\\dist\\");
        System.out.println(f1.compareTo(f2));
    }
}
