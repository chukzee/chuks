/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import chuks.server.HttpServer;
import chuks.server.SimpleServerConfigException;
import chuks.server.http.impl.SimpleHttpServer;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import javax.swing.JFrame;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class Launcher {

    private static final String default_host = "localhost";
    private static final int default_port = 80;
    private final String host;
    private final int port;

    public Launcher(String host, int port) {
        this.host = host;
        this.port = port;
    }

    private static HttpServer startServerUsingConfig(String configFile, boolean is_command_line) throws SimpleServerConfigException, IOException {

        //build the server
        HttpServer server = new SimpleHttpServer.ServerBuilder()
                .buildUsingConfig(configFile);

        //start the server     
        server.start();
        
        return server;
    }

    private static HttpServer manuallyStartServer() throws SimpleServerConfigException, IOException {
        System.out.println();
        System.out.println("--------PLEASE NOTE---------");
        System.out.println();

        System.out.println("The manunal startup process will guide you through only the basic \n"
                          + "configuration of the server. For more advance setup, please use\n"
                          + "configuration file with relevant settings provided.");
        System.out.println();
        System.out.println("--------BEGIN MANUAL SETUP---------");
        System.out.println();

        System.out.print("Enter host name <default is " + default_host + "> :");
        byte[] b = new byte[100];

        String host = new BufferedReader(new InputStreamReader(System.in)).readLine();

        if (host.isEmpty()) {
            host = default_host;
        }

        //System.out.println(host);
        System.out.print("Enter port number  <default is " + default_port + "> :");
        b = new byte[100];
        //num = new BufferedInputStream(System.in).read(b);
        String str_port = new BufferedReader(new InputStreamReader(System.in)).readLine();
        if (str_port.isEmpty()) {
            str_port = String.valueOf(default_port);
        }
        int port = Integer.parseInt(str_port);

        //String default_str_web_root = "C:/wamp/www/";
        String default_str_web_root = "/";
        System.out.print("Enter web root  <default is " + default_str_web_root + "> :");
        b = new byte[100];
        String str_web_root = new BufferedReader(new InputStreamReader(System.in)).readLine();
        if (str_web_root.isEmpty()) {
            str_web_root = default_str_web_root;
        }

        //String default_str_class_path = "C:/wamp/www/traysa/";
        String default_str_class_path = "/dist/";
        System.out.print("Enter class path  <default is " + default_str_class_path + "> :");
        b = new byte[100];
        String str_class_path = new BufferedReader(new InputStreamReader(System.in)).readLine();
        if (str_class_path.isEmpty()) {
            str_class_path = default_str_class_path;
        }

        //String default_str_lib_path = "C:/wamp/www/traysa/lib/";
        String default_str_lib_path = "/dist/lib/";
        System.out.print("Enter library path  <default is " + default_str_lib_path + "> :");
        b = new byte[100];
        String str_lib_path = new BufferedReader(new InputStreamReader(System.in)).readLine();
        if (str_lib_path.isEmpty()) {
            str_lib_path = default_str_lib_path;
        }

        String default_str_extension_disguise = "no extension";
        System.out.print("Enter disguised extension for class files  <default is " + default_str_extension_disguise + "> :");
        b = new byte[100];
        String str_extension_disguise = new BufferedReader(new InputStreamReader(System.in)).readLine();

        int cache_default_port = 10023;
        System.out.print("Enter cache port number  <default is " + cache_default_port + "> :");
        b = new byte[100];
        String str_cache_port = new BufferedReader(new InputStreamReader(System.in)).readLine();
        if (str_cache_port.isEmpty()) {
            str_cache_port = String.valueOf(cache_default_port);
        }
        int cache_port = Integer.parseInt(str_cache_port);

        System.out.print("Enter remote cache servers names seperated by comma <e.g hostname1:port1,hostname2:port2 > :");
        b = new byte[100];
        String str_cache_servers = new BufferedReader(new InputStreamReader(System.in)).readLine();
        String[] cache_servers = str_cache_servers.split(",");
        for (int i = 0; i < cache_servers.length; i++) {
            cache_servers[i] = cache_servers[i].trim();
        }

        boolean is_display_error = false;
        System.out.print("Enable error output Y/N? <default is N or No> :");
        b = new byte[100];
        String display_error = new BufferedReader(new InputStreamReader(System.in)).readLine();
        if (display_error.equalsIgnoreCase("y") || display_error.equalsIgnoreCase("yes")) {
            is_display_error = true;
        }

        //finally - specify file to save configuartion
        System.out.print("Specify filename to save configuration <Or Skip>:");
        b = new byte[100];
        String configFileName = new BufferedReader(new InputStreamReader(System.in)).readLine();

        boolean overwriteConfig = true;
        if (configFileName != null && !configFileName.trim().isEmpty()) {
            System.out.print("Overwrite any existing config file on same location Y/N? <default is Y or Yes> :");
            b = new byte[100];
            String overwrite = new BufferedReader(new InputStreamReader(System.in)).readLine();
            if (!overwrite.equalsIgnoreCase("y")
                    && !overwrite.equalsIgnoreCase("yes")
                    && !overwrite.isEmpty()) {
                overwriteConfig = false;
            }
        }

        //build the server
        HttpServer server = new SimpleHttpServer.ServerBuilder()
                .setBind(host)
                .setPort(port)
                .setCachePort(cache_port)
                .setWebRoot(str_web_root)
                .setClassPath(str_class_path)
                .setLibraryPath(str_lib_path)
                .setDisguisedExtension(str_extension_disguise)
                .setEnableErrorOutput(is_display_error)
                .setCacheServersAddresses(cache_servers)
                .setSaveConfigToFile(configFileName, overwriteConfig)
                .build();

        //start the server
        server.start();
        return server;
    }

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws IOException, SimpleServerConfigException {

        System.out.print("Specify startup config file to start server <Or skip to start manually> :");
        byte[] b = new byte[100];

        String choose = new BufferedReader(new InputStreamReader(System.in)).readLine();

        HttpServer server;
        if (choose.isEmpty()) {
            server = manuallyStartServer();
        } else {
            server = startServerUsingConfig(choose, true);
        }
        
        if(server.isRunning()){            
            handleExit(server);
        }

        
    }

    static void handleExit(HttpServer server) throws IOException {
        System.out.println("to exit program type 'quit'  or 'q' : ");
        while (true) {
            byte[] b = new byte[100];
            InputStream in;
            int num = (in = System.in).read(b);
            String input = new String(b, 0, num).trim();
            if (input.equalsIgnoreCase("quit")
                    || input.equalsIgnoreCase("q")) {
                System.out.println("program terminates");
                in.close();
                server.stop();
                System.exit(0);
            } else {
                System.out.println("to exit program type 'quit'  or 'q' : ");
            }
        }
    }

}
