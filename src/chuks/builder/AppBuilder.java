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
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
import java.io.BufferedInputStream;
import java.io.FileFilter;
import java.io.InputStream;
import java.io.StringReader;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.regex.Pattern;
import javax.lang.model.SourceVersion;
import org.apache.commons.io.FileUtils;
import sun.management.FileSystem;

/**
 *
 * @author USER
 */
public class AppBuilder {

    String webRoot = "";

    Gson gson = new Gson();

    public AppBuilder() {

    }

    String getConfigFilePath() {
        return normalizeFileName(webRoot + Config.MAIN_PATH + Config.INCLUDE_FILE);
    }

    String getMainJsFilePath() {
        return normalizeFileName(webRoot + Config.MAIN_PATH + Config.MAIN_JS_FILE);
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

    private void createProject(String app_namespace, String workspace_dir) throws AppBuilderException {

        if (!workspace_dir.endsWith("/")) {
            workspace_dir = workspace_dir + "/";
        }

        File wrDir = new File(workspace_dir);
        if (!wrDir.exists()) {
            if (!wrDir.mkdirs()) {
                throw new AppBuilderException("could not create workspace - "+wrDir.getAbsolutePath());
            }
        }

        //in order to avoid overwriting important file we must make sure 
        //the Config.INCLUDE_FILE files does not exist!
        if (new File(workspace_dir).list().length > 0) {
            System.out.println("The specified workspace must be empty "
                    + "to avoid accidental overwriting of important files at:\n " + workspace_dir);
            return;
        }

        for (String p : Config.APP_DIR_STRUTURE) {
            File dir = new File(workspace_dir + p);
            //create the workspace directory structure
            if (!dir.mkdirs()) {//create the workspace structure
                throw new AppBuilderException("could not create workspace!.");
            }
        }

        /*Include inc = new Include();
        inc.setNamespace(app_namepace);
        Gson pretty_gson = new GsonBuilder()
                .setPrettyPrinting()
                .create();
        
        inc.setBuild(null);// do not appear - not neccessary
        
        String str_inc = pretty_gson.toJson(inc, Include.class);
         */
        try {

            //create develop index
            createDevIndexPage(workspace_dir);

            //create device indexes for small, medium and large
            createDeviceIndexPage(workspace_dir);

            //create the include file
            createDevIncludeFile(workspace_dir, app_namespace);

            String main_js_filename = normalizeFileName(workspace_dir + Config.MAIN_PATH + Config.MAIN_JS_FILE);
            //writeToFile(main_js_filename, "the Main.js content goes here");//TODO
            
            System.err.println("TODO - Auto create the " + Config.MAIN_JS_FILE);// REMIND - store in the jar just has the index.html of build
            
            System.out.println("Workspace location: "+ wrDir.getAbsolutePath());
            System.out.println("Project successfully created.");
        } catch (AppBuilderException ex) {
            //reverse process
            clearDir(normalizeFileName(workspace_dir));
            throw new AppBuilderException(ex);
        } catch (Exception ex) {
            //reverse process
            clearDir(normalizeFileName(workspace_dir));
            throw new AppBuilderException(ex);
        }
    }

    void clearDir(String dir) {
        try {
            File[] files = new File(dir).listFiles();
            for (File f : files) {
                if (f.isDirectory()) {
                    deleteFolder(f);
                } else {
                    f.delete();
                }
            }
        } catch (Exception e) {
            //Do nothing
        }
    }

    public boolean build(String web_root) throws AppBuilderException {

        if (web_root == null || web_root.isEmpty()) {
            throw new AppBuilderException("App web root path must be provided.");
        }
        if (!web_root.endsWith("/") && !web_root.endsWith("\\")) {
            web_root = web_root + '/';//since we expect a directory
        }
        webRoot = normalizeFileName(web_root);
        String str_json = null;
        try {
            str_json = readAll(getConfigFilePath()).toString();
        } catch (AppBuilderException ex) {
            if (ex.getCause() instanceof FileNotFoundException) {
                throw new AppBuilderException("The specified web root is either not a project folder or the config file is missing.", ex);
            }
            throw new AppBuilderException(ex);
        }
        try {
            createBuild(str_json);
        } catch (AppBuilderException ex) {
            //reverse process
            clearDir(normalizeFileName(web_root + Config.BUILD_PATH));
            throw new AppBuilderException(ex);
        } catch (Exception ex) {
            //reverse process
            clearDir(normalizeFileName(web_root + Config.BUILD_PATH));
            throw new AppBuilderException(ex);
        }
        return true;

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
                    if (line[i] == space && double_quote_count % 2 == 0) {
                        break;
                    }
                    sb.append(line[i]);

                }

                String str = sb.toString();
                if (str.length() > 1 && str.startsWith("\"") && str.endsWith("\"")) {
                    str = str.substring(1, str.length() - 1);
                }
                l.add(str);
            }

        }

        return l.toArray(args);
    }

    public static void main(String... args) {

        AppBuilder ab = new AppBuilder();
        if (args.length == 0) {
            Scanner sc = new Scanner(System.in);
            String line = sc.nextLine();
            args = getCommandLine(line);
        }

        if (args.length == 0) {

            Help.show();
            System.exit(1);
        }
        if (args.length >= 1) {
            if (null == args[0]) {
                //specify the cause of the failure

                Help.show();
                System.exit(1);
            } else {
                switch (args[0]) {
                    case "-v":
                    case "--version":
                        System.out.println(Config.APP_NAME + "\n" + getVersion());
                        break;
                    case "-h":
                    case "--help":
                        Help.show();
                        break;
                    case "-b":
                    case "--build":
                        if (args.length != 2) {
                            System.out.println("invalid number of arguments - app webroot must be provided!");
                            Help.usage("-b");
                            return;
                        }
                        try {
                            String path = args[1];
                            ab.build(path);
                        } catch (AppBuilderException ex) {
                            Logger.getLogger(AppBuilder.class.getName()).log(Level.SEVERE, null, ex);
                            System.err.println("App build failed!");
                        }
                        break;
                    case "-c":
                    case "--create":
                        if (args.length != 3) {
                            System.out.println("invalid number of arguments");
                            Help.usage("-c");
                            return;
                        }
                        String app_namespace = args[1];
                        if (!SourceVersion.isName(app_namespace)) {
                            System.out.println("app namespace is not valid or not allowed - " + app_namespace);
                            Help.usage("-c");
                            return;
                        }
                        String workspace_dir = args[2];
                        try {
                            ab.createProject(app_namespace, workspace_dir);
                        } catch (AppBuilderException ex) {
                            Logger.getLogger(AppBuilder.class.getName()).log(Level.SEVERE, null, ex);
                            System.err.println("App project creation failed!");
                        }
                        break;
                    default:
                        //specify the cause of the failure

                        Help.show();
                        System.exit(1);
                }
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

    private void createBuild(String str_json) throws AppBuilderException {

        Include dev_include = gson.fromJson(str_json, Include.class);

        prepareDir();

        Include prod_include = new Include();

        prod_include.setNamespace(dev_include.getNamespace());
        prod_include.setAppName(dev_include.getAppName());
        BuildObj build = prod_include.getBuild();
        build.setProd(true);
        build.setMergeJs(
                mergeArrays(//absolute js will not be included here
                        dev_include.getApp().getJs(),
                        dev_include.getSmall().getJs(),
                        dev_include.getMedium().getJs(),
                        dev_include.getLarge().getJs()
                )
        );
        buildJs(dev_include, prod_include);

        System.out.println("Succesfullly minified javascript...");

        buildCss(dev_include, prod_include);

        System.out.println("Succesfullly minified css...");
        System.out.println("Finishing build...");

        createProdIncludeFile(prod_include);
        createProdIndexPage(prod_include);

        System.out.println("App build successfully.");
    }

    public void buildJs(Include dev_include, Include prod_include) throws AppBuilderException {

        doBiuldJs("main", dev_include, prod_include);//does not need condition

        if (dev_include.getSmall().getJs().length > 0) {
            doBiuldJs("small", dev_include, prod_include);
        }

        if (dev_include.getMedium().getJs().length > 0) {
            doBiuldJs("medium", dev_include, prod_include);
        }

        if (dev_include.getLarge().getJs().length > 0) {
            doBiuldJs("large", dev_include, prod_include);
        }

    }

    public void buildCss(Include dev_include, Include prod_include) throws AppBuilderException {

        if (dev_include.getApp().getCss().length > 0
                || dev_include.getApp().getCss().length > 0) {
            doBuildCss("main", dev_include, prod_include);
        }

        if (dev_include.getSmall().getCss().length > 0) {
            doBuildCss("small", dev_include, prod_include);
        }

        if (dev_include.getMedium().getCss().length > 0) {
            doBuildCss("medium", dev_include, prod_include);
        }

        if (dev_include.getLarge().getCss().length > 0) {
            doBuildCss("large", dev_include, prod_include);
        }

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

    private void prepareDir() throws AppBuilderException {

        File dir = new File(webRoot + Config.BUILD_PATH);
        deleteFolder(dir);

        for (String d : Config.BIULD_DIR_STRUTURE) {
            dir = new File(webRoot + d);
            if (!dir.mkdirs()) {//create the build structure
                throw new AppBuilderException("could not prepare build directory.");
            }
        }

        System.out.println("Copying relevant files to build directory...");

        for (String d : Config.APP_DIR_STRUTURE) {
            if (d.endsWith("/resources")
                    || d.endsWith("/fonts")
                    || d.endsWith("/images")) {

                try {
                    File dirFrom = new File(normalizeFileName(webRoot + d));
                    File dirTo = new File(normalizeFileName(webRoot + Config.BUILD_PATH + d));
                    FileUtils.copyDirectory(dirFrom, dirTo, false);
                } catch (FileNotFoundException ex) {
                    //do nothing
                } catch (IOException ex) {
                    throw new AppBuilderException(ex);
                }
            }
        }

        try {
            copyToLevelDeviceFiles("small");
            copyToLevelDeviceFiles("medium");
            copyToLevelDeviceFiles("large");
        } catch (IOException ex) {
            throw new AppBuilderException(ex);
        }

    }

    private void copyToLevelDeviceFiles(String cat) throws IOException {
        File dir1 = new File(normalizeFileName(webRoot + "device/" + cat));
        File[] files = dir1.listFiles(File::isFile); // a normal files

        for (File f : files) {
            File dir2 = new File(normalizeFileName(webRoot + Config.BUILD_PATH + "/device/" + cat));
            FileUtils.copyFileToDirectory(f, dir2, false);
        }

    }

    private void doBiuldJs(String cat, Include dev_include, Include prod_include) throws AppBuilderException {
        Sources sources;
        String compiled_file_name;

        switch (cat) {
            case "main": {

                System.out.println("Merging global js files...");

                String[] abs = refacResPath(dev_include.getAbsolute().getJs(), "");
                String[] app = refacResPath(dev_include.getApp().getJs(), "/app/js/");
                String[] mn = mergeArrays(abs, app);

                String main_filename = getMainJsFilePath();
                StringBuilder main_file_data = readAll(main_filename);
                sources = new Sources();
                sources.put(main_filename, main_file_data);
                sources.put("", "Main.init({prod: true});");//initialize the app
                sources.put("", "Main.build = function(){");//wrapper begin

                String[] le_abs = refacResPath(dev_include.getAbsolute().getLoadExceptions(), "");
                String[] le_app = refacResPath(dev_include.getApp().getLoadExceptions(), "/app/Load_exceptions/");
                String[] exceptions_files = mergeArrays(le_abs, le_app);
                for (String filename : mn) {
                    sources.put(filename, readAll(filename, exceptions_files));
                }

                sources.put("", "}");//wrapper end
                //prod_include.getBuild().getApp().setJs(new String[]{fpath});//NOT REQUIRED IN THIS CASE - SINCE THEY MERGE WITH THE Main.js
                compiled_file_name = normalizeFileName(webRoot
                        + Config.BUILD_PATH
                        + "/app/"
                        + Config.JS_COMPILED_MAIN_FILE);

            }
            break;
            case "small": {

                System.out.println("Merging small device js files...");

                String[] small = refacResPath(dev_include.getSmall().getJs(), "/device/small/js/");
                String[] exceptions_files = refacResPath(dev_include.getSmall().getLoadExceptions(), "/device/small/Load_exceptions/");
                sources = new Sources();
                for (String filename : small) {
                    sources.put(filename, readAll(filename, exceptions_files));
                }

                prod_include.getBuild().getSmall().setJs(new String[]{Config.JS_COMPILED_SMALL_FILE});
                compiled_file_name = normalizeFileName(webRoot
                        + Config.BUILD_PATH
                        + "/device/small/js/"
                        + Config.JS_COMPILED_SMALL_FILE);
            }
            break;
            case "medium": {

                System.out.println("Merging medium device js files...");

                String[] medium = refacResPath(dev_include.getMedium().getJs(), "/device/medium/js/");
                String[] exceptions_files = refacResPath(dev_include.getMedium().getLoadExceptions(), "/device/medium/Load_exceptions/");
                sources = new Sources();
                for (String filename : medium) {
                    sources.put(filename, readAll(filename, exceptions_files));
                }

                prod_include.getBuild().getMedium().setJs(new String[]{Config.JS_COMPILED_MEDIUM_FILE});
                compiled_file_name = normalizeFileName(webRoot
                        + Config.BUILD_PATH
                        + "/device/medium/js/"
                        + Config.JS_COMPILED_MEDIUM_FILE);
            }
            break;
            case "large": {

                System.out.println("Merging large device js files...");

                String[] large = refacResPath(dev_include.getLarge().getJs(), "/device/large/js/");
                String[] exceptions_files = refacResPath(dev_include.getLarge().getLoadExceptions(), "/device/large/Load_exceptions/");
                sources = new Sources();
                for (String filename : large) {
                    sources.put(filename, readAll(filename, exceptions_files));
                }

                prod_include.getBuild().getLarge().setJs(new String[]{Config.JS_COMPILED_LARGE_FILE});
                compiled_file_name = normalizeFileName(webRoot
                        + Config.BUILD_PATH
                        + "/device/large/js/"
                        + Config.JS_COMPILED_LARGE_FILE);

            }
            break;

            default:
                return;
        }

        Compressor jscomp = CompressorFactory.getJsCompressor();
        jscomp.compress(sources, compiled_file_name);

    }

    private void doBuildCss(String cat, Include dev_include, Include prod_include) throws AppBuilderException {
        Sources sources;
        String compiled_file_name;

        switch (cat) {
            case "main": {

                System.out.println("Merging global css files...");

                String[] abs = refacResPath(dev_include.getAbsolute().getCss(), "");
                String[] app = refacResPath(dev_include.getApp().getCss(), "/app/css/");
                String[] mn = mergeArrays(abs, app);
                String[] le_abs = refacResPath(dev_include.getAbsolute().getLoadExceptions(), "");
                String[] le_app = refacResPath(dev_include.getApp().getLoadExceptions(), "/app/Load_exceptions/");
                String[] exceptions_files = mergeArrays(le_abs, le_app);
                sources = new Sources();
                for (String filename : mn) {
                    sources.put(filename, readAll(filename, exceptions_files));
                }

                sources.put("", "}");//wrapper end

                prod_include.getBuild().getApp().setCss(new String[]{Config.CSS_COMPILED_MAIN_FILE});
                compiled_file_name = normalizeFileName(webRoot
                        + Config.BUILD_PATH
                        + "/app/css/"
                        + Config.CSS_COMPILED_MAIN_FILE);

            }
            break;
            case "small": {

                System.out.println("Merging small device css files...");

                String[] small = refacResPath(dev_include.getSmall().getCss(), "/device/small/css/");
                String[] exceptions_files = refacResPath(dev_include.getSmall().getLoadExceptions(), "/device/small/Load_exceptions/");
                sources = new Sources();
                for (String filename : small) {
                    sources.put(filename, readAll(filename, exceptions_files));
                }

                prod_include.getBuild().getSmall().setCss(new String[]{Config.CSS_COMPILED_MAIN_FILE});
                compiled_file_name = normalizeFileName(webRoot
                        + Config.BUILD_PATH
                        + "/device/small/css/"
                        + Config.CSS_COMPILED_MAIN_FILE);
            }
            break;
            case "medium": {

                System.out.println("Merging medium device css files...");

                String[] medium = refacResPath(dev_include.getMedium().getCss(), "/device/medium/css/");
                String[] exceptions_files = refacResPath(dev_include.getMedium().getLoadExceptions(), "/device/medium/Load_exceptions/");
                sources = new Sources();
                for (String filename : medium) {
                    sources.put(filename, readAll(filename, exceptions_files));
                }

                prod_include.getBuild().getMedium().setCss(new String[]{Config.CSS_COMPILED_MAIN_FILE});
                compiled_file_name = normalizeFileName(webRoot
                        + Config.BUILD_PATH
                        + "/device/medium/css/"
                        + Config.CSS_COMPILED_MAIN_FILE);
            }
            break;
            case "large": {

                System.out.println("Merging large device css files...");

                String[] large = refacResPath(dev_include.getLarge().getCss(), "/device/large/css/");
                String[] exceptions_files = refacResPath(dev_include.getLarge().getLoadExceptions(), "/device/large/Load_exceptions/");
                sources = new Sources();
                for (String filename : large) {
                    sources.put(filename, readAll(filename, exceptions_files));
                }

                prod_include.getBuild().getLarge().setCss(new String[]{Config.CSS_COMPILED_MAIN_FILE});
                compiled_file_name = normalizeFileName(webRoot
                        + Config.BUILD_PATH
                        + "/device/large/css/"
                        + Config.CSS_COMPILED_MAIN_FILE);

            }
            break;

            default:
                return;
        }

        Compressor csscomp = CompressorFactory.getCssCompressor();
        csscomp.compress(sources, compiled_file_name);

    }

    private String[] refacResPath(String[] paths, String string) {
        String web_root = webRoot;

        for (int i = 0; i < paths.length; i++) {
            paths[i] = web_root + string + paths[i];
            paths[i] = normalizeFileName(paths[i]);
        }

        return paths;
    }

    public static String normalizeFileName(String name) {
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

    private void createProdIncludeFile(Include prod_include) throws AppBuilderException {
        String prod_json = gson.toJson(prod_include);
        String file = normalizeFileName(webRoot + Config.BUILD_PATH + "/app/" + Config.INCLUDE_FILE);
        writeToFile(file, prod_json);
    }

    private void createProdIndexPage(Include include) throws AppBuilderException {
        InputStream in = this.getClass().getClassLoader().getResourceAsStream("chuks/resources/build_index.html");
        if (in == null) {
            throw new AppBuilderException("Could not create index.html for build - html template resource not found. Make sure the installation is correct.");
        }
        Scanner s = new Scanner(in);
        String html = "";
        while (s.hasNextLine()) {
            html += s.nextLine() + "\n";
        }
        String app_js = Config.JS_COMPILED_MAIN_FILE;
        String js_path = Config.MAIN_PATH.endsWith("/") ? Config.MAIN_PATH : Config.MAIN_PATH + "/";
        html = html.replaceFirst("\\{app_js\\}", js_path + app_js);//replace {app_js}
        html = html.replaceFirst("\\{app_name\\}", include.getAppName());//replace {app_name}

        String file = normalizeFileName(webRoot + Config.BUILD_PATH + "/index.html");
        writeToFile(file, html);

    }

    private void createDevIncludeFile(String workspace, String namespace) throws AppBuilderException {
        InputStream in = this.getClass().getClassLoader().getResourceAsStream("chuks/resources/dev_include_json");
        if (in == null) {
            throw new AppBuilderException("Could not create include.json for development - template resource not found. Make sure the installation is correct.");
        }
        Scanner s = new Scanner(in);
        String json = "";
        while (s.hasNextLine()) {
            json += s.nextLine() + "\n";
        }

        json = json.replaceFirst("\\{namespace\\}", namespace);//replace {app_js}
        json = json.replaceFirst("\\{app_name\\}", "App Name");//replace {app_name}

        //verify if the json syntax is valid
        try {
            JsonParser jp = new JsonParser();
            JsonElement je = jp.parse(json);

        } catch (JsonSyntaxException e) {
            throw new AppBuilderException("Invalid json syntax - possibly the internal resource file is corrupt or application not properly installed.", e);
        }

        String file = normalizeFileName(workspace + Config.MAIN_PATH + Config.INCLUDE_FILE);
        writeToFile(file, json);
    }

    private void createDevIndexPage(String workspace) throws AppBuilderException {
        InputStream in = this.getClass().getClassLoader().getResourceAsStream("chuks/resources/dev_index.html");
        if (in == null) {
            throw new AppBuilderException("Could not create index.html for development - html template resource not found. Make sure the installation is correct.");
        }
        Scanner s = new Scanner(in);
        String html = "";
        while (s.hasNextLine()) {
            html += s.nextLine() + "\n";
        }
        String main_js = Config.MAIN_PATH + Config.MAIN_JS_FILE;
        html = html.replaceFirst("\\{main_js\\}", main_js);//replace {app_js}
        //html = html.replaceFirst("\\{app_name\\}", include.getAppName());//replace {app_name}

        String file = workspace + "index.html";
        writeToFile(file, html);
    }

    private void createDeviceIndexPage(String workspace) throws AppBuilderException {
        InputStream in = this.getClass().getClassLoader().getResourceAsStream("chuks/resources/device_index.html");
        if (in == null) {
            throw new AppBuilderException("Could not create index.html for development - html template resource not found. Make sure the installation is correct.");
        }
        Scanner s = new Scanner(in);
        String html = "";
        while (s.hasNextLine()) {
            html += s.nextLine() + "\n";
        }
        writeToFile(normalizeFileName(workspace + "/device/small/index.html"), html);
        writeToFile(normalizeFileName(workspace + "/device/medium/index.html"), html);
        writeToFile(normalizeFileName(workspace + "/device/large/index.html"), html);
    }

    void writeToFile(String file, String content) throws AppBuilderException {

        FileOutputStream out = null;
        try {
            out = new FileOutputStream(file);
            out.write(content.getBytes());
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
