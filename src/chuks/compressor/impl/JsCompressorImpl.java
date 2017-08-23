/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.compressor.impl;

import chuks.builder.Sources;
import chuks.builder.exception.AppBuilderException;
import chuks.compressor.Compressor;
import chuks.compressor.impl.closure.ClosureCompressor;
import chuks.compressor.impl.ugly.UglifyCompressor;
import chuks.compressor.impl.yui.YuiCompressor;

/**
 *
 * @author USER
 */
public class JsCompressorImpl implements Compressor{

    public JsCompressorImpl() {
    }

    @Override
    public boolean compress(Sources sb, String outfile) throws AppBuilderException {
        
        if(sb == null || sb.length() == 0){
            return false;
        }
        
        if(new ClosureCompressor().compressJs(sb, outfile)){
            return true;
        }else if(new YuiCompressor().compressJs(sb, outfile)){
            return true;
        }else if(new UglifyCompressor().compressJs(sb, outfile)){
            return true;
        }
        
        return false;
    }

    
    
    
}
