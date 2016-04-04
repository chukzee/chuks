/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import chuks.server.SimpleHttpServerException;
import chuks.server.http.HttpRequestFormat;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.nio.channels.SocketChannel;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author USER
 */
class PostRequest extends RequestValidator {

    private int headersLength;
    private int finalBoundaryEndLength;
    private int subBoundaryEndLength;
    private int nextSubBoundaryIndex;
    private int nextFinalBoundaryIndex;
    private StringBuilder boundary;
    private boolean hasBoundary;
    private char[] final_boundary_end;
    private char[] sub_boundary_end;
    private int final_boundary_end_length;
    private int sub_boundary_end_length;
    private boolean formDataStarted;
    private char[] crlf = "\r\n".toCharArray();
    private char[] two_crlf = "\r\n\r\n".toCharArray();
    private boolean boundaryHeaderStarted;
    private int nextTwo_crlfIndex;
    StringBuffer content_headers = null;
    StringBuffer form_data_value = null;
    private int form_data_length;
    private int content_length;
    private boolean isFormUrlEncoded;
    private byte[] RequestData = new byte[0];
    private int request_data_length;
    private boolean isDoneAnalyze;
    private int field_index;
    private byte[] formField;
    private File tmpFile;
    private FileOutputStream finTmp;

    PostRequest(RequestTask task) throws UnsupportedEncodingException {
        super(task);
        this.hasBoundary = task.hasBoundary;
        this.boundary = task.boundary;
        this.headersLength = task.headersLength;
        this.final_boundary_end = task.final_boundary_end;
        this.sub_boundary_end = task.sub_boundary_end;
        this.final_boundary_end_length = task.final_boundary_end_length;
        this.sub_boundary_end_length = task.sub_boundary_end_length;
        this.content_length = task.content_length;
        this.isFormUrlEncoded = task.isFormUrlEncoded;

    }

    private PostRequest() throws UnsupportedEncodingException {
        super(null);
    }

    @Override
    void validateRequest(byte[] recv, int offset, int size) throws UnsupportedEncodingException, IOException, SimpleHttpServerException {

    if (request.isChunkedTransferEncoding() && content_length > 0) {
            //it is illegal to set both chunk transfer encode and content length
            handleBadRequest();
        } else if (content_length > 0) {
            analyzePostByContentLenth(recv, offset, size);
        } else if (request.isChunkedTransferEncoding()) {
            handlePostByChunk(recv, size);
        } else {
            handleUnsupportedHttpOperation();
        }

    }

    private void handlePostByChunk(byte[] arr, int size) {

        //for now this is not supported - but i will allow suport in the nearest future
        handleUnsupportedHttpOperation();//TO BE REMOVED WHEN CHUNKED TRANSFER ENCODING IS SUPPORTED
    }

    private void processFormValue(int data_length) {
        /*if (postRequestListener == null) {
         return;
         }*/
        if (isFileData) {
            HttpFileObjectImpl httpFileObject = new RequestValidator.HttpFileObjectImpl();

            httpFileObject.setFileSize(data_length);
            httpFileObject.setFilename(fileName);
            if (fileObjMap == null) {
                fileObjMap = new HashMap();
            }
            fileObjMap.put(formFieldName, httpFileObject);
        } else {
            if (fieldMap == null) {
                fieldMap = new HashMap();
            }
            fieldMap.put(formFieldName, new String(formDataBuffer, 0, data_length));
        }
    }

    private void processFormValue(byte[] arr, int size, int minus_length) throws FileNotFoundException, IOException {

        int ap_size = size - field_index;

        if (isFileData) {
            finTmp.write(arr, field_index, ap_size);
            finTmp.flush();
            long real_size = tmpFile.length() - minus_length;
            finTmp.getChannel().truncate(real_size);
            finTmp.close();
            HttpFileObjectImpl httpFileObject = new RequestValidator.HttpFileObjectImpl();

            httpFileObject.setFileSize(real_size);
            httpFileObject.setFilename(fileName);
            httpFileObject.setTemporaryFile(tmpFile);
            if (fileObjMap == null) {
                fileObjMap = new HashMap();
            }
            fileObjMap.put(formFieldName, httpFileObject);

        }

        if (isFormFieldValue) {

            byte[] new_b = new byte[formField.length + ap_size];
            System.arraycopy(formField, 0, new_b, 0, formField.length);
            System.arraycopy(arr, field_index, new_b, formField.length, ap_size);
            formField = new_b;
            String field_value = new String(formField, 0, formField.length - minus_length);

            if (fieldMap == null) {
                fieldMap = new HashMap();
            }

            fieldMap.put(formFieldName, field_value);
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

                    /*//NOTE NECESSARY
                     * if (k == 0 && !dp_lower_case.equals("form-data")) {
                     //first attribute must be form-data. 
                     break;
                     }*/

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

    private void analyzeMultiPartFormData(byte[] arr, int offset, int size) throws IOException, SimpleHttpServerException {

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
                        if (isFileData) {
                            createTempFileStream();
                        }
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
                    processFormValue(arr, i, sub_boundary_end_length + 1);
                }

                formDataStarted = false;
                content_headers = new StringBuffer();
                continue;
            }

            if (finalBoundaryEndLength == final_boundary_end_length) {
                if (formDataStarted) {
                    processFormValue(arr, i, final_boundary_end_length + 1);
                }

                formDataStarted = false;
                isDoneAnalyze = true;
                return;
            }
        }//for loop end

        if (formDataStarted) {
            int ap_size = size - field_index;

            if (isFileData) {
                finTmp.write(arr, field_index, ap_size);
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
    long total_elapse;

    private void analyzeFormURLEncodedData(byte[] arr, int offset, int size) throws UnsupportedEncodingException {

        if (RequestData == null || RequestData.length==0) {
            RequestData = new byte[content_length + headersLength];
        }

        System.arraycopy(arr, 0, RequestData, request_data_length, size);
        
        request_data_length += size;

        if (request_data_length == RequestData.length) {
            isDoneAnalyze = true;
        }

    }

    private void analyzePostByContentLenth(byte[] arr, int offset, int size) throws UnsupportedEncodingException, FileNotFoundException, IOException, SimpleHttpServerException {

        if (hasBoundary) {
            analyzeMultiPartFormData(arr, offset, size);
        }

        if (isFormUrlEncoded) {
            analyzeFormURLEncodedData(arr, offset, size);
        }

        //finally
        if (isDoneAnalyze) {
            
            Map param_map = request.createParametersMap(RequestData, headersLength);
            RequestObject req = new RequestObject();
            req.setPostUrl(param_map);
            req.setField(fieldMap);
            req.setFile(fileObjMap);

            fieldMap = null;//gc it
            fileObjMap = null;//gc it

            notifyWebApp(req);

        }

    }

    /**
     * The techique used here is faster than using File.createTempFile() in java
     * jdk
     *
     * @return
     * @throws IOException
     * @throws SimpleHttpServerException
     */
    private File createTemporaryFile() throws IOException, SimpleHttpServerException {
        int index = this.fileName.lastIndexOf(".");
        String suffix = fileName.substring(index);
        boolean isCreated;
        File file;
        long time = Long.MAX_VALUE;
        int MAX_CREATE_TIME = 30000;//
        do {
            long elapse = System.currentTimeMillis() - time;
            if (elapse > MAX_CREATE_TIME) {
                throw new SimpleHttpServerException("Creating temporary file timed out! duration " + MAX_CREATE_TIME + "ms");
            }
            time = System.currentTimeMillis();
            String filename = ServerConfig.TEMP_DIR + time + suffix;
            file = new File(filename);
            isCreated = file.createNewFile();
            if (!isCreated) {
                //try again by appending random number
                filename = ServerConfig.TEMP_DIR + time + ServerUtil.randomNextLong() + suffix;
                file = new File(filename);
                isCreated = file.createNewFile();
            }
        } while (!isCreated);

        return file;
    }

    private void createTempFileStream() throws IOException, SimpleHttpServerException {
        try {
            tmpFile = createTemporaryFile();
            finTmp = new FileOutputStream(tmpFile, true);
        } catch (IOException | SimpleHttpServerException ex) {
            if (finTmp != null) {
                finTmp.close();//release resources
                finTmp = null;
            }
            throw ex;
        }
    }

    public static void main(String args[]) throws IOException, SimpleHttpServerException {
        PostRequest p = new PostRequest();
        long time = System.nanoTime();
        p.fileName = "Chuks.jpg";
        //ServerConfig.TEMP_DIR = "C:\\Users\\USER\\Documents\\testTmp\\";
        File f = p.createTemporaryFile();

        long elapse = System.nanoTime() - time;
        System.out.println("elapse " + elapse / Math.pow(10.0, 9));

        System.out.println(f.getPath());
        //Files.move(null, null, options);
        File fp = new File("C:\\Users\\USER\\Documents\\testTmp\\move\\move2\\move3\\chuks_move.jpg").getParentFile();
        if(!fp.exists()){
            fp.mkdirs();
        }
        f.renameTo(new File("C:\\Users\\USER\\Documents\\testTmp\\move\\move2\\move3\\chuks_move.jpg"));
        //new File("C:\\Users\\USER\\Documents\\testTmp\\move\\move2\\move3\\chuks_move.jpg").createNewFile();
        //System.out.println("total_elapse " + (total_elapse += elapse) / Math.pow(10.0, 9));

    }
}
