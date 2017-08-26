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
public class Help {

    private static final String[] cmd = {
        "-b or --build [web_root_path] --->  builds the source into the build directory.",
        "-c or --create [app_namespace] [web_root_path] --->  create the workspace of the application.",
        "-h or --help --->  show list of commands and their usages",
        "-v or --version ---> show the version of this build tool"
    };

    public static void show() {
        System.out.println("\nAvailable commands and their usages\n");
        for (String c : cmd) {
            System.out.println(c);
        }
    }

    public static void usage(String shortCmd) {
        for (String c : cmd) {
            if (c.trim().startsWith(shortCmd.trim() + " ")) {
                System.out.println("\nUsage:\n");
                System.out.println(c);
                break;
            }
        }
    }
}
