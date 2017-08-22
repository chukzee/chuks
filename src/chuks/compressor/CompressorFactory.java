/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.compressor;

import chuks.compressor.Compressor;
import chuks.compressor.impl.CssCompressorImpl;
import chuks.compressor.impl.JsCompressorImpl;

/**
 *
 * @author USER
 */
 public class CompressorFactory {
    
    public static Compressor getCssCompressor(){
        return new CssCompressorImpl();
    }
    public static Compressor getJsCompressor(){
        return new JsCompressorImpl();
    }
}
