/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public enum Attr {
    Header,
    ServerHost,
    ServerPort,
    WebRoot,
    ClassPath,
    LibraryPath,
    ExtensionDisguise,
    EnableErrorOutput,
    EnableRemoteCache,
    MaxRemoteCacheHandlerThreads,
    DefaultIndexFileExtension,
    
    //cache config attributes goes below
    
    CachePort,
    CacheServers,
    MaxSendRemoteCacheTrials,
    MaxReqestCacheFileSize,
    CacheTimeToLive,
    MaxMemoryCacheIdleTime,
    UseMemoryCacheShrinker,
    MemoryCacheShrinkerInterval,
    SpoolCache,
    IsCacheEternal,
    MaxCacheSpoolPerRun,
    CacheSpoolChunkSize,
    UseDiskCache,
    SwapCacheToDisk,
    MaxCacheSize,
    MaxCachedObjects,
    CacheDiskPath, 
    
}
