/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.compressor.impl.ugly;

import chuks.builder.Sources;
import chuks.builder.exception.AppBuilderException;
import chuks.compressor.JsCompressor;

/**
 *
 * @author USER
 */
public class UglifyCompressor implements JsCompressor{

    @Override
    public boolean compressJs(Sources sb, String outfile) throws AppBuilderException {
        System.out.println("Minifying javacript... using Uglify.");
        
        throw new UnsupportedOperationException(UglifyCompressor.class.getName()+" not yet implemented."); //To change body of generated methods, choose Tools | Templates.
    }
    
}
