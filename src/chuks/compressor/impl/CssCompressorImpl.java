/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.compressor.impl;

import chuks.builder.Sources;
import chuks.builder.exception.AppBuilderException;
import chuks.compressor.Compressor;
import chuks.compressor.impl.yui.YuiCompressor;

/**
 *
 * @author USER
 */
public class CssCompressorImpl implements Compressor{

    public CssCompressorImpl() {
    }

    @Override
    public boolean compress(Sources sb, String outfile) throws AppBuilderException {
        if(sb == null || sb.length() == 0){
            return false;
        }
        return new YuiCompressor().compressCss(sb, outfile);
    }

    
    
    
}
