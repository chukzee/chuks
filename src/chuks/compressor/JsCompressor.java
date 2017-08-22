/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.compressor;

import chuks.builder.Sources;
import chuks.builder.exception.AppBuilderException;

/**
 *
 * @author USER
 */
public interface JsCompressor {


    public boolean compressJs(Sources sb, String outfile) throws AppBuilderException;

}
