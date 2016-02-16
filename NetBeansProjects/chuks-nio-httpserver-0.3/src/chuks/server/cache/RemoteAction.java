/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.cache;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface RemoteAction {
    Enum ADD_DISK = CacheActionType.ADD_DISK;
    Enum ADD_MEMORY = CacheActionType.ADD_MEMORY;
    Enum REMOVE_DISK = CacheActionType.REMOVE_DISK;
    Enum REMOVE_MEMORY = CacheActionType.REMOVE_MEMORY;
    
    Enum getActionType();

}
