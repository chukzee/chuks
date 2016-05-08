/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import chuks.server.HttpFileObject;
import chuks.server.Request;
import java.util.Map;

/**
 *
 * @author USER
 */
class RequestObject implements Request {

    Map<String, Value> getMap;
    Map<String, Value> postUrlMap;
    Map<String, String> fieldMap;
    Map<String, HttpFileObject> fileObjs;

    RequestObject() {

    }

    void setGet(Map map) {
        getMap = map;
    }

    void setPostUrl(Map map) {
        postUrlMap = map;
    }

    void setField(Map map) {
        fieldMap = map;
    }

    void setFile(Map map) {
        fileObjs = map;
    }

    @Override
    public Value get(String name) {
        if (getMap == null) {
            return null;
        }
        return getMap.get(name);
    }

    @Override
    public String postField(String field_name) {
        if (fieldMap == null) {
            return null;
        }
        return fieldMap.get(field_name);
    }

    @Override
    public HttpFileObject postFile(String field_name) {
        if (fileObjs == null) {
            return null;
        }
        return fileObjs.get(field_name);
    }

    @Override
    public Value postURL(String name) {
        if (postUrlMap == null) {
            return null;
        }
        return postUrlMap.get(name);
    }

}
