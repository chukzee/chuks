/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.builder;

import java.util.ArrayList;

/**
 *
 * @author USER
 */
public class Sources {

    ArrayList<String> fileList = new ArrayList();
    ArrayList<Integer> lineCounts = new ArrayList();
    ArrayList<StringBuilder> contentList = new ArrayList();
    String sep = "\n";

    void put(String name, StringBuilder content) {

        content.append(sep);
        fileList.add(name);
        contentList.add(content);
        int line_count = sourceLineCount(content);
        lineCounts.add(line_count);
    }

    void put(String name, String content) {
        put(name, new StringBuilder(content));
    }

    public String join() {
        StringBuilder sb = new StringBuilder();
        for (StringBuilder s : contentList) {
            sb.append(s);
        }

        return sb.toString();
    }

    public LineFile getLineFile(int line) {
        int index = -1;
        int cur_len = 0;
        int prev_len = 0;
        int file_line = -1;
        String filename = "";
        StringBuilder data = null;
        for (int line_count : lineCounts) {
            index++;
            cur_len += line_count;
            if (cur_len >= line) {
                file_line = line - prev_len;
                filename = this.fileList.get(index);
                data = this.contentList.get(index);
                break;
            }

            prev_len = cur_len;
        }
        return new LineFile(filename, file_line, data);
    }

    private int sourceLineCount(StringBuilder content) {
        int line_count = 0;
        char[] c = content.toString().toCharArray();
        for (int i = 0; i < c.length; i++) {
            if (c[i] == '\n') {
                line_count++;
            }
        }
        return line_count;
    }

    public int length() {
        return contentList.size();
    }

    public static class LineFile {

        private final String fileName;
        private final int line;
        private final StringBuilder data;

        public LineFile(String name, int line, StringBuilder data) {
            this.fileName = name;
            this.line = line;
            this.data = data;
        }

        public String getFileName() {
            return fileName;
        }

        public int getLine() {
            return line;
        }

        public StringBuilder getData() {
            return data == null ? new StringBuilder() : data;
        }

    }
}
