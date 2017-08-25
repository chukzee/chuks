/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.builder;

/**
 *
 * @author USER
 */
public interface Config {

    String APP_NAME = "AppBuilder";
    String MAIN_PATH = "/app/";
    String INCLUDE_FILE = "include.json";
    
    String CSS_COMPILED_MAIN_FILE = "css-main-min.css";
    String CSS_COMPILED_SMALL_FILE = "css-sd-min.css";
    String CSS_COMPILED_MEDIUM_FILE = "css-md-min.css";
    String CSS_COMPILED_LARGE_FILE = "css-ld-min.css";
    
    String MAIN_JS_FILE = "Main.js";
    String JS_COMPILED_MAIN_FILE = "app-min.js";
    String JS_COMPILED_SMALL_FILE = "app-sd-min.js";
    String JS_COMPILED_MEDIUM_FILE = "app-md-min.js";
    String JS_COMPILED_LARGE_FILE = "app-ld-min.js";
    
    String CSS_COMP_FILE = "css-all-min.css";
    String BUILD_PATH = "/build";

    
    String[] BIULD_DIR_STRUTURE = new String[]{
        BUILD_PATH,
        BUILD_PATH + "/app",
        BUILD_PATH + "/app/resources",
        BUILD_PATH + "/app/images",
        BUILD_PATH + "/app/fonts",
        BUILD_PATH + "/app/css",
        BUILD_PATH + "/device/small/resources",
        BUILD_PATH + "/device/small/images",
        BUILD_PATH + "/device/small/fonts",
        BUILD_PATH + "/device/small/css",
        BUILD_PATH + "/device/small/js",
        BUILD_PATH + "/device/medium/resources",
        BUILD_PATH + "/device/medium/images",
        BUILD_PATH + "/device/medium/fonts",
        BUILD_PATH + "/device/medium/css",
        BUILD_PATH + "/device/medium/js",
        BUILD_PATH + "/device/large/resources",
        BUILD_PATH + "/device/large/images",
        BUILD_PATH + "/device/large/fonts",
        BUILD_PATH + "/device/large/css",
        BUILD_PATH + "/device/large/js"};


    String[] APP_DIR_STRUTURE = new String[]{
         "/app/resources",
         "/app/images",
         "/app/fonts",
         "/app/css",
         "/app/js",//will not be included in the build structure
         "/device/small/resources",
         "/device/small/images",
         "/device/small/fonts",
         "/device/small/css",
         "/device/small/js",
         "/device/medium/resources",
         "/device/medium/images",
         "/device/medium/fonts",
         "/device/medium/css",
         "/device/medium/js",
         "/device/large/resources",
         "/device/large/images",
         "/device/large/fonts",
         "/device/large/css",
         "/device/large/js"};
}
