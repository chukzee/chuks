/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.request;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
 interface RequestFileInfo {
    //Note class file are not included here since we have already design cache implementation for them.
    int CLASS_FILE = 10;//TO BE REMOVE- NOT NEEDED ANY MORE
    int FILE_FOUND = 20;
    int FILE_NOT_FOUND = 30;
    int FILE_TYPE_NOT_SUPPORTED = 40;
    int FORBIDDEN = 50;
}
