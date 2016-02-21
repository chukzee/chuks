/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import chuks.server.http.request.ServerConfig;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.spi.FileTypeDetector;

/**
 *
 * @author USER
 */
public class TestMultipartDecode1 {

    private byte[] sub_boundary_end;
    private int nextSubBoundaryIndex;
    private int subBoundaryEndLength;
    private int sub_boundary_end_length;
    private byte[] final_boundary_end;
    private int nextFinalBoundaryIndex;
    private int finalBoundaryEndLength;
    private int final_boundary_end_length;
    private boolean boundaryContentStarted;
    private boolean formDataStarted;
    private boolean boundaryContentEnded;
    private boolean isStop;
    private char[] lowerCaseContenDispositon = "content-disposition: ".toCharArray();
    private char[] upperCaseContenDispositon = "CONTENT-DISPOSITION: ".toCharArray();
    private char[] crlf = "@&".toCharArray();
    private char[] two_crlf = "@&@&".toCharArray();
    private boolean boundaryHeaderStarted;
    private int nextTwo_crlfIndex;
    private int two_crlfEndLength;
    StringBuffer content_headers = null;
    StringBuffer form_data_value = null;
    private boolean isFormFieldValue;
    private byte[] pending_form_data = new byte[0];
    //private byte[] formDataBuffer = new byte[0];
    private int form_data_length;
    private boolean isFileData;
    private String formFieldName;
    private String fileName;
    private byte[] skip_append = new byte[final_boundary_end_length];
    private int total_skip = 0;
    private String TmpFile = "C:\\Users\\USER\\Documents\\new_test.txt";
    private int field_index;
    private byte[] formField;
    private boolean isDoneAnalyze;

    private void handleStatusOK() {
        System.out.println("send Status OK");
    }
    private StringBuffer d = new StringBuffer();

    private void processFormValue(byte[] arr, int size, int minus_length) throws FileNotFoundException, IOException {
      
            int ap_size = size - field_index;

            if (isFileData) {
                try (FileOutputStream finTmp = new FileOutputStream(TmpFile, true)) {//closes automatically using try resource
                    finTmp.write(arr, field_index, ap_size);
                    long real_size = new File(TmpFile).length() - minus_length;
                    finTmp.getChannel().truncate(real_size);
                }
            }

            if (isFormFieldValue) {

                byte[] new_b = new byte[formField.length + ap_size];
                System.arraycopy(formField, 0, new_b, 0, formField.length);
                System.arraycopy(arr, field_index, new_b, formField.length, ap_size);
                formField = new_b;
                String field_value = new String(formField, 0, formField.length - minus_length);
                
                System.out.println(new String(formField));
                System.out.println(field_value);
            }
            
            
        //System.out.println(new String(this.formDataBuffer, 0, data_length));
    }

    private void decodeContentHeader(StringBuffer content_headers) {

        this.isFileData = false;//initialize
        this.isFormFieldValue = false;//initialize

        String str_hearder = content_headers.toString();
        String[] header_split = str_hearder.split(String.valueOf(crlf));
        for (int i = 0; i < header_split.length; i++) {
            String original_case_header = header_split[i];
            String lowercase_header = original_case_header.toLowerCase();
            if (lowercase_header.startsWith("content-disposition: ")) {
                String dp_cont = original_case_header.substring("content-disposition: ".length());
                String[] dp_split = dp_cont.split(";");
                for (int k = 0; k < dp_split.length; k++) {

                    String dp_split_trim = dp_split[k].trim();
                    String dp_lower_case = dp_split_trim.toLowerCase();

                    if (k == 0 && !dp_lower_case.equals("form-data")) {
                        //first attribute must be form-data. 
                        break;
                    }
                    if (dp_lower_case.startsWith("name=")) {
                        this.isFormFieldValue = true;
                        this.formFieldName = dp_split_trim.substring(6, dp_split_trim.length() - 1);
                    }
                    if (dp_lower_case.startsWith("filename=")) {
                        this.isFileData = true;
                        this.isFormFieldValue = false;
                        this.fileName = dp_split_trim.substring(10, dp_split_trim.length() - 1);
                    }
                }
            }

            if (lowercase_header.startsWith("content-type: ")) {
                //NOT YET IMPLEMENTED
            }

            if (lowercase_header.startsWith("content-transfer-encoding: ")) {
                if (lowercase_header.substring("content-transfer-encoding: ".length()).equalsIgnoreCase("binary")) {
                    this.isFileData = true;
                    this.isFormFieldValue = false;
                }
            }
        }
    }

    private byte[] appendByte(byte[] b1, byte[] b2) {
        byte[] new_b = new byte[b1.length + b2.length];
        System.arraycopy(b1, 0, new_b, 0, b1.length);
        System.arraycopy(b2, 0, new_b, b1.length, b2.length);
        return new_b;
    }

    private void analyzeMultiPartFormData_1(byte[] arr, int offset, int size) throws FileNotFoundException, IOException {
        //long time = System.nanoTime();
        field_index = 0;

        for (int i = offset; i < size; i++) {
            if (sub_boundary_end[nextSubBoundaryIndex] == arr[i]) {
                subBoundaryEndLength++;
                nextSubBoundaryIndex++;
                if (nextSubBoundaryIndex == sub_boundary_end_length) {
                    nextSubBoundaryIndex = 0;
                }
            } else {
                subBoundaryEndLength = 0;
                nextSubBoundaryIndex = 0;
            }

            if (final_boundary_end[nextFinalBoundaryIndex] == arr[i]) {
                finalBoundaryEndLength++;
                nextFinalBoundaryIndex++;
                if (nextFinalBoundaryIndex == final_boundary_end_length) {
                    nextFinalBoundaryIndex = 0;
                }
            } else {
                finalBoundaryEndLength = 0;
                nextFinalBoundaryIndex = 0;
            }

            if (boundaryHeaderStarted) {
                content_headers.append((char) arr[i]);
                if (two_crlf[nextTwo_crlfIndex] == arr[i]) {
                    nextTwo_crlfIndex++;
                    if (nextTwo_crlfIndex == two_crlf.length) {
                        nextTwo_crlfIndex = 0;
                        boundaryHeaderStarted = false;
                        formDataStarted = true;
                        decodeContentHeader(content_headers);
                        form_data_length = 0;
                        field_index = i + 1;
                        formField = new byte[0];
                        continue;
                    }
                } else {
                    nextTwo_crlfIndex = 0;
                }
            }


            if (subBoundaryEndLength == sub_boundary_end_length) {
                boundaryHeaderStarted = true;
                if (formDataStarted) {
                    processFormValue(arr, i, sub_boundary_end_length+1);
                }

                formDataStarted = false;
                content_headers = new StringBuffer();
                continue;
            }

            if (finalBoundaryEndLength == final_boundary_end_length) {
                if (formDataStarted) {
                    processFormValue(arr, i, final_boundary_end_length+1);
                }

                formDataStarted = false;
                isDoneAnalyze = true;
                return;
            }
        }//for loop end

        if (formDataStarted) {
            int ap_size = size - field_index;

            if (isFileData) {
                try (FileOutputStream finTmp = new FileOutputStream(TmpFile, true)) {//closes automatically using try resource
                    finTmp.write(arr, field_index, ap_size);
                }
            }

            if (isFormFieldValue) {

                byte[] new_b = new byte[formField.length + ap_size];
                System.arraycopy(formField, 0, new_b, 0, formField.length);
                System.arraycopy(arr, field_index, new_b, formField.length, ap_size);
                formField = new_b;
            }

        }

        //long elapse = System.nanoTime() - time;
        //System.out.println("elapse " + elapse / Math.pow(10.0, 9));
        //System.out.println("total_elapse " + (total_elapse += elapse) / Math.pow(10.0, 9));
    }

    public static void main(String... agrs) throws FileNotFoundException, IOException {

        TestMultipartDecode1 t = new TestMultipartDecode1();

        byte[] arr = ("--AaB03x"
                + "@&"
                + "content-disposition: form-data; name=\"field1\""
                + "@&"
                + "@&"
                + "This is $field1"
                + "@&"
                + "--AaB03x"
                + "@&"
                + "content-disposition: form-data; name=\"field2\""
                + "@&"
                + "@&"
                + "This is $field2"
                + "@&"
                + "--AaB03x"
                + "@&"
                + "content-disposition: form-data; name=\"userfile\"; filename=\"$filename\""
                + "@&"
                + "Content-Type: $mimetype"
                + "@&"
                + "Content-Transfer-Encoding: binary"
                + "@&"
                + "@&"
                + "$binarydata"
                + "@&"
                + "--AaB03x--").getBytes();

        t.sub_boundary_end = "--AaB03x@&".getBytes();
        t.final_boundary_end = "--AaB03x--".getBytes();

        t.sub_boundary_end_length = t.sub_boundary_end.length;
        t.final_boundary_end_length = t.final_boundary_end.length;

        //System.out.println("full size " + arr.length);

        int t_size = 0;
        while (true) {
            //int size = (int) (Math.random() * 3);
            int size = 4;
            if (t_size + size > arr.length) {
                size = arr.length - t_size;
            }

            byte[] buff = new byte[size];

            System.arraycopy(arr, t_size, buff, 0, buff.length);

            t.analyzeMultiPartFormData_1(buff, 0, buff.length);
            if (t_size == arr.length) {
                break;
            }
            t_size += size;

            //System.out.println("t_size " + t_size);
        }

        byte[] g1 = "12".getBytes();
        byte[] g2 = "0".getBytes();

        //System.out.println(new String(t.appendByte(g1, g2)));
        System.out.println(ServerConfig.TEMP_DIR);
    }

    private static class request {

        private static int getContentLength() {
            return 40000;
        }

        public request() {
        }
    }
}
