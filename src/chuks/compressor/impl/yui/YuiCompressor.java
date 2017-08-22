/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.compressor.impl.yui;

import chuks.builder.Sources;
import chuks.builder.exception.AppBuilderException;
import chuks.compressor.JsCompressor;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.Writer;
import java.util.logging.Level;
import java.util.logging.Logger;
 
//import org.apache.commons.io.IOUtils;
import org.mozilla.javascript.ErrorReporter;
import org.mozilla.javascript.EvaluatorException;
 
import com.yahoo.platform.yui.compressor.JavaScriptCompressor;
import com.yahoo.platform.yui.compressor.CssCompressor;

import java.io.ByteArrayInputStream;
import java.io.UnsupportedEncodingException;
/**
 *
 * @author USER
 */
public class YuiCompressor implements chuks.compressor.JsCompressor, chuks.compressor.CssCompressor{

    Sources sources;
    private static Logger logger = Logger.getLogger(YuiCompressor.class.getName());
    Options o = new Options(); 
    
    public static class Options {
        
        public String charset = "UTF-8";
        public int lineBreakPos = -1;
        public boolean munge = true;
        public boolean verbose = false;
        public boolean preserveAllSemiColons = false;
        public boolean disableOptimizations = false;
    }
    
    private class YuiCompressorErrorReporter implements ErrorReporter {
    public void warning(String message, String sourceName, int line, String lineSource, int lineOffset) {
        
        if (line < 0) {
            logger.log(Level.WARNING, message);
        } else {
            Sources.LineFile lineFile = sources.getLineFile(line);
            logger.log(Level.WARNING, "{0}:{1}:{2}:{3}", new Object[]{lineFile.getLine(), lineOffset, lineFile.getFileName(), message});
        }
    }
 
    @Override
    public void error(String message, String sourceName, int line, String lineSource, int lineOffset) {
        
        if (line < 0) {
            logger.log(Level.SEVERE, message);
        } else {
            Sources.LineFile lineFile = sources.getLineFile(line);
            logger.log(Level.SEVERE, "{0}:{1}:{2}:{3}", new Object[]{lineFile.getLine(), lineOffset, lineFile.getFileName(),  message});
        }
    }
 
    @Override
    public EvaluatorException runtimeError(String message, String sourceName, int line, String lineSource, int lineOffset) {
        error(message, sourceName, line, lineSource, lineOffset);
        return new EvaluatorException(message);
    }
}

    @Override
    public boolean compressJs(Sources sb, String outfile){
        
        System.out.println("Minifying javacript... using YuiCompressor.");
        
        sources = sb;
        Reader in = null;
        Writer out = null;
        try {
            in = new InputStreamReader(new ByteArrayInputStream(sb.join().getBytes()), o.charset);
            JavaScriptCompressor compressor = new JavaScriptCompressor(in, new YuiCompressorErrorReporter());
            out = new OutputStreamWriter(new FileOutputStream(outfile));
            compressor.compress(out,
                    o.lineBreakPos,
                    o.munge,
                    o.verbose,
                    o.preserveAllSemiColons, 
                    o.disableOptimizations);
            out.flush();
            return true;
        } catch (UnsupportedEncodingException ex) {
            Logger.getLogger(YuiCompressor.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException | EvaluatorException ex) {
            Logger.getLogger(YuiCompressor.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
                if (in!=null) {
                    in.close();
                }
                if (out!=null) {
                    out.close();
                }
            } catch (IOException ex) {
                Logger.getLogger(YuiCompressor.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return false;
    }

    @Override
    public boolean compressCss(Sources sb, String outfile) throws AppBuilderException {
        
        System.out.println("Minifying css... using YuiCompressor.");
        
        sources = sb;
        Reader in = null;
        Writer out= null;
        try {
            in = new InputStreamReader(new ByteArrayInputStream(sb.join().getBytes()), o.charset);
            CssCompressor compressor = new CssCompressor(in);
            out = new OutputStreamWriter(new FileOutputStream(outfile));
            compressor.compress(out, o.lineBreakPos);
            out.flush();
            return true;
        } catch (UnsupportedEncodingException ex) {
            Logger.getLogger(YuiCompressor.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException | EvaluatorException ex) {
            Logger.getLogger(YuiCompressor.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
                if (in!=null) {
                    in.close();
                }
                if (out!=null) {
                    out.close();
                }
            } catch (IOException ex) {
                Logger.getLogger(YuiCompressor.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        
        return false;
    }
}