/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server;

import chuks.server.http.request.Value;

/**
 *
 * @author USER
 */
public interface Request {

    /**
     * returns the value of the parameter specified in a GET request query
     * string.
     *
     * @param name name of the parameter in the GET request query string
     * @return the value of the parameter
     */
    Value get(String name);

    /**
     * Returns the field value for the specified field name of a POST request
     *
     * @param field_name name of field
     * @return value of field
     */
    String postField(String field_name);

    /**
     * Returns the {@code HttpFileObject} object representing the specified
     * field name of a POST request of file type
     *
     * @param field_name name of field
     * @return {@code HttpFileObject} object representing specified field name
     */
    HttpFileObject postFile(String field_name);

    /**
     * returns the value of the parameter specified in a POST request query
     * string.
     *
     * @param name name of the parameter in the POST request query string
     * @return the value of the parameter
     */
    Value postURL(String name);
}
