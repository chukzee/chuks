/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.builder;

import chuks.builder.exception.AppBuilderException;
import chuks.json.structure.BuildObj;
import chuks.json.structure.Include;
import chuks.json.structure.Obj;
import com.google.gson.Gson;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.JSONObject;
import org.json.JSONString;
import chuks.compressor.Compressor;
import chuks.compressor.CompressorFactory;
import java.io.BufferedInputStream;
import java.io.InputStream;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.regex.Pattern;

/**
 *
 * @author USER
 */
public class AppBuilder {

    private static String APP_NAME = "AppBuilder";

    String webRoot = "";
    final String mainPath = "/app/";
    final String buildPath = "/build/";
    final String includeFile = "include.json";
    final String mainJsFile = "Main.js";
    final private String JS_COMP_FILE = "app-min.js";
    final private String CSS_COMP_FILE = "css-all-min.css";

    Gson gson = new Gson();

    public AppBuilder() {

    }

    String getConfigFilePath() {
        return nomalizeFileName(webRoot + mainPath + includeFile);
    }

    String getMainJsFilePath() {
        return nomalizeFileName(webRoot + mainPath + mainJsFile);
    }

    private String getBuildFilename(String file) {
        return nomalizeFileName(webRoot + buildPath + file);
    }

    StringBuilder readAll(String path) throws AppBuilderException {
        return readAll(path, null);
    }

    StringBuilder readAll(String path, String[] exceptionsFiles) throws AppBuilderException {

        FileInputStream fstream = null;
        StringBuilder data = new StringBuilder();
        try {
            fstream = new FileInputStream(path);
            byte[] buff = new byte[1024];
            int size;

            while ((size = fstream.read(buff)) > -1) {
                data.append(new String(buff, 0, size));
            }

        } catch (FileNotFoundException ex) {
            boolean except_this = false;
            if (exceptionsFiles != null) {
                for (String file : exceptionsFiles) {
                    if (path != null && path.equals(file)) {
                        except_this = true;
                        break;
                    }
                }
            }
            if (!except_this) {
                throw new AppBuilderException(ex);
            }
        } catch (IOException ex) {
            throw new AppBuilderException(ex);
        } finally {
            try {
                if (fstream != null) {
                    fstream.close();
                }
            } catch (IOException ex) {
                Logger.getLogger(AppBuilder.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        return data;
    }

    public boolean build(String web_root) throws AppBuilderException {

        if (web_root == null || web_root.isEmpty()) {
            throw new AppBuilderException("App web root path must be provided.");
        }
        if(!web_root.endsWith("/") && !web_root.endsWith("\\")){
            web_root = web_root + '/';//since we expect a directory
        }
        webRoot = nomalizeFileName(web_root);
        String str_json = readAll(getConfigFilePath()).toString();
        createBuild(str_json);
        return true;

    }

    private static void Usage() {
        System.out.println("Usage:\n\n"
                + "-b or --build [web_root_path] --->  builds the source into a build directory."
                + "");
    }

    //NOT YET FULLY IMPLEMENTED - VERSION SHOULD BE RETRIEVED FROM AN EXTERNAL FILE
    private static String getVersion() {
        return "version: 0.0.1";
    }

    public static String[] getCommandLine(String str_line) {
        String[] args = new String[0];
        ArrayList<String> l = new ArrayList();
        int double_quote_count = 0;
        char space = ' ';
        char[] line = str_line.toCharArray();
        for (int i = 0; i < line.length; i++) {

            if (line[i] != space) {
                StringBuilder sb = new StringBuilder();
                for (; i < line.length; i++) {
                    
                    if (line[i] == '"') {
                        double_quote_count++;
                    }
                    if (line[i] == space && double_quote_count%2 ==0) {
                        break;
                    }
                    sb.append(line[i]);
                    
                }
                
                String str = sb.toString();
                if(str.length() > 1 && str.startsWith("\"") && str.endsWith("\"")){
                   str = str.substring(1, str.length()-1);
                }
                l.add(str);
            }

        }

        return l.toArray(args);
    }

    public static void main(String... args) throws AppBuilderException {
        AppBuilder ab = new AppBuilder();
        if (args.length == 0) {
            Scanner sc = new Scanner(System.in);
            String line = sc.nextLine();
            args = getCommandLine(line);
        }

        if (args.length == 0) {

            Usage();
            System.exit(1);
        }
        if (args.length == 1) {
            if ("-v".equals(args[0]) || "--version".equals(args[0])) {
                System.out.println(APP_NAME + "\n" + getVersion());
            } else {
                //specify the cause of the failure
                if ("-b".equals(args[0]) || "--build".equals(args[0])) {
                    System.err.println("Please specify the web root.");
                }

                Usage();
                System.exit(1);
            }
        }
        if (args.length >= 2) {
            if (("-b".equals(args[0]) || "--build".equals(args[0]))
                    && !args[1].isEmpty()) {
                String path = args[1];
                ab.build(path);
            } else if (("-c".equals(args[0]) || "--create".equals(args[0]))
                    && !args[1].isEmpty()) {
                System.out.println("TODO!");
            } else {
                Usage();
                System.exit(1);
            }
        }
    }

    private String[] mergeArrays(String[]... tos) {
        int len = 0;
        for (String[] to : tos) {
            len += to.length;
        }
        String[] arr = new String[len];
        int pos = 0;
        for (String[] to : tos) {
            System.arraycopy(to, 0, arr, pos, to.length);
            pos += to.length;
        }
        return arr;
    }

    private Include productionIncludeJson(Include dev_include) {

        Include prod_include = new Include();

        prod_include.setNamespace(dev_include.getNamespace());
        prod_include.setAppName(dev_include.getAppName());

        BuildObj build = new BuildObj();
        build.setProd(true);

        String css_file = buildPath + CSS_COMP_FILE;
        String[] prod_css = new String[]{css_file};

        build.getAbsolute().setCss(prod_css);

        prod_include.setBuild(build);

        return prod_include;

    }

    private void createBuild(String str_json) throws AppBuilderException {

        Include include = gson.fromJson(str_json, Include.class);

        prepareDir();
        String[] exceptions_files = this.getIncludeLoadExceptionsFiles(include);
        
        System.out.println("Merging javacript files...");
        
        Sources sb = prepareJs(getIncludeJsFiles(include), exceptions_files);
        Compressor jscomp = CompressorFactory.getJsCompressor();
        jscomp.compress(sb, getBuildFilename(JS_COMP_FILE));
        
        System.out.println("Succesfullly minified javascript...");
        
        System.out.println("Merging css files...");    
        
        Sources cb = prepareCss(getIncludeCssFiles(include), exceptions_files);
        Compressor csscomp = CompressorFactory.getCssCompressor();
        csscomp.compress(cb, getBuildFilename(CSS_COMP_FILE));

        System.out.println("Succesfullly minified css...");
        
        System.out.println("Finishing build...");
        createProdIncludeFile(include);
        
        createProdIndexPage(include);
        
        System.out.println("App build successfully.");
    }

    public static void deleteFolder(File folder) {
        File[] files = folder.listFiles();
        if (files != null) { //some JVMs return null for empty dirs
            for (File f : files) {
                if (f.isDirectory()) {
                    deleteFolder(f);
                } else {
                    f.delete();
                }
            }
        }
        folder.delete();
    }

    private void prepareDir() {
        File dir = new File(webRoot + buildPath);
        deleteFolder(dir);
        dir.mkdir();
    }

    private Sources prepareJs(String[] include_js, String[] exceptions_files) throws AppBuilderException {

        String main_filename = getMainJsFilePath();
        StringBuilder main_file_data = readAll(getMainJsFilePath());
        Sources main_js = new Sources();
        main_js.put(main_filename, main_file_data);
        
        main_js.put("", "Main.init({prod: true});");//initialize the app
        
        main_js.put("", "Main.build = function(){");//wrapper begin

        for (String filename : include_js) {
            main_js.put(filename, readAll(filename, exceptions_files));
        }

        main_js.put("", "}");//wrapper end

        return main_js;
    }

    private Sources prepareCss(String[] include_css, String[] exceptions_files) throws AppBuilderException {

        Sources css = new Sources();
        for (String j : include_css) {
            css.put(j, readAll(j, exceptions_files));
        }

        return css;
    }

    private String[] getIncludeJsFiles(Include include) {

        String[] abs = refacResPath(include.getAbsolute().getJs(), "");
        String[] app = refacResPath(include.getApp().getJs(), "/app/js/");
        String[] small = refacResPath(include.getSmall().getJs(), "/device/small/js/");
        String[] medium = refacResPath(include.getMedium().getJs(), "/device/medium/js/");
        String[] large = refacResPath(include.getLarge().getJs(), "/device/large/js/");

        return mergeArrays(abs, app, small, medium, large);
    }

    private String[] getIncludeCssFiles(Include include) {

        String[] abs = refacResPath(include.getAbsolute().getCss(), "");
        String[] app = refacResPath(include.getApp().getCss(), "/app/css/");
        String[] small = refacResPath(include.getSmall().getCss(), "/device/small/css/");
        String[] medium = refacResPath(include.getMedium().getCss(), "/device/medium/css/");
        String[] large = refacResPath(include.getLarge().getCss(), "/device/large/css/");

        return mergeArrays(abs, app, small, medium, large);
    }

    private String[] getIncludeLoadExceptionsFiles(Include include) {

        String[] abs = refacResPath(include.getAbsolute().getLoadExceptions(), "");
        String[] app = refacResPath(include.getApp().getLoadExceptions(), "/app/css/");
        String[] small = refacResPath(include.getSmall().getLoadExceptions(), "/device/small/css/");
        String[] medium = refacResPath(include.getMedium().getLoadExceptions(), "/device/medium/css/");
        String[] large = refacResPath(include.getLarge().getLoadExceptions(), "/device/large/css/");

        return mergeArrays(abs, app, small, medium, large);
    }

    private String[] refacResPath(String[] paths, String string) {
        String web_root = webRoot;

        for (int i = 0; i < paths.length; i++) {
            paths[i] = web_root + string + paths[i];
            paths[i] = nomalizeFileName(paths[i]);
        }

        return paths;
    }

    public static String nomalizeFileName(String name) {
        String n = name;
        do {
            n = n.replaceAll("\\\\", "/");
            n = n.replaceAll("//", "/");
            if (n.equals(name)) {
                break;
            }
            name = n;
        } while (true);

        return n;
    }

    private void createProdIncludeFile(Include include) throws AppBuilderException {
        FileOutputStream out = null;
        try {
            Include prod_include = productionIncludeJson(include);
            String prod_json = gson.toJson(prod_include);
            String file = webRoot + buildPath + includeFile;
            out = new FileOutputStream(file);
            out.write(prod_json.getBytes());
        } catch (FileNotFoundException ex) {
            throw new AppBuilderException(ex);
        } catch (IOException ex) {
            throw new AppBuilderException(ex);
        } finally {
            try {
                if (out != null) {
                    out.close();
                }
            } catch (IOException ex) {
                Logger.getLogger(AppBuilder.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    private void createProdIndexPage(Include include) throws AppBuilderException {
        InputStream in = this.getClass().getClassLoader().getResourceAsStream("chuks/builder/index.html");
        if(in == null){
            throw new AppBuilderException("Could not create index.html for build - html template resource not found. Make sure the installation is correct.");
        }
        Scanner s = new Scanner(in);
        String html = "";
        while(s.hasNextLine()){
            html+=s.nextLine()+"\n";
        }
        String app_js = JS_COMP_FILE;
        html = html.replaceFirst("\\{app_js\\}", app_js);//replace {app_js}
        html = html.replaceFirst("\\{app_name\\}",  include.getAppName());//replace {app_name}
        
        FileOutputStream out = null;
        try {
            String file = webRoot + buildPath + "index.html";
            out = new FileOutputStream(file);
            out.write(html.getBytes());
        } catch (FileNotFoundException ex) {
            throw new AppBuilderException(ex);
        } catch (IOException ex) {
            throw new AppBuilderException(ex);
        } finally {
            try {
                if (out != null) {
                    out.close();
                }
            } catch (IOException ex) {
                Logger.getLogger(AppBuilder.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        
    }
    
    
}
