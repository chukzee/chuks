/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.compressor.impl.closure;

import chuks.builder.Sources;
import chuks.builder.exception.AppBuilderException;
import chuks.compressor.JsCompressor;
import com.google.javascript.jscomp.CheckLevel;
import com.google.javascript.jscomp.CommandLineRunner;
import com.google.javascript.jscomp.CompilationLevel;
import com.google.javascript.jscomp.CompilerOptions;
import com.google.javascript.jscomp.Compiler;
import com.google.javascript.jscomp.JSError;
import com.google.javascript.jscomp.SourceFile;
import com.google.javascript.jscomp.ErrorHandler;
import com.google.javascript.jscomp.ErrorManager;
import com.google.javascript.jscomp.LoggerErrorManager;
import com.google.javascript.jscomp.PropertyRenamingPolicy;
import com.google.javascript.jscomp.VariableRenamingPolicy;
import com.google.javascript.jscomp.WarningsGuard;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author USER
 */
public class ClosureCompressor implements JsCompressor {

    private static final String[] _disabledMessages = {"Non-JSDoc comment has annotations.", "Type annotations are not allowed here", "illegal use of unknown JSDoc tag", "Parse error. invalid param name", "dangerous use of the global this", "Misplaced function annotation. This JSDoc is not attached to a function node. Are you missing parentheses?"};
    private ArrayList<String> warnErrReptitions = new ArrayList();
    Sources sources;

    @Override
    public boolean compressJs(Sources sb, String outfile) throws AppBuilderException {
        System.out.println("Minifying javacript... using Closure-Compiler.");
        sources = sb;
        try {
            String cmp = compile(sb.join());
            OutputStreamWriter out = new OutputStreamWriter(new FileOutputStream(outfile));
            out.write(cmp, 0, cmp.length());
            out.flush();
            out.close();
            return true;
        } catch (IOException ex) {
            Logger.getLogger(ClosureCompressor.class.getName()).log(Level.SEVERE, null, ex);
        }

        return false;
    }

    public String compile(String code) throws IOException {
        Compiler compiler = new Compiler();

        CompilerOptions opts = new CompilerOptions();
        opts.setLanguageIn(CompilerOptions.LanguageMode.ECMASCRIPT5);
        opts.setPrettyPrint(false);
        /*
        // Advanced mode is used here, but additional options could be set, too.
        CompilationLevel.ADVANCED_OPTIMIZATIONS.setOptionsForCompilationLevel(opts);
        opts.setVariableRenaming(VariableRenamingPolicy.LOCAL);
        opts.setPropertyRenaming(PropertyRenamingPolicy.OFF);
        opts.setInlineFunctions(false);
         */

        CompilationLevel.SIMPLE_OPTIMIZATIONS.setOptionsForCompilationLevel(opts); //to be on the safer side

        WarningsGuard warnGuard = new WarningsGuard() {
            public CheckLevel level(JSError jsError) {
                for (String msg : ClosureCompressor._disabledMessages) {
                    if (jsError.description.contains(msg)) {
                        return CheckLevel.OFF;
                    }
                }
                return jsError.getDefaultLevel();
            }
        };
        opts.addWarningsGuard(warnGuard);

        opts.setErrorHandler(new ErrorHandler() {
            @Override
            public void report(CheckLevel checkLevel, JSError jsError) {
                String mark = jsError.lineNumber +":"+jsError.getCharno()+":"+jsError.description;
                if(warnErrReptitions.contains(mark)){
                    return;//prevent repitition
                }
                warnErrReptitions.add(mark);
                
                for (String msg : ClosureCompressor._disabledMessages) {
                    if (jsError.description.contains(msg)) {
                        return;
                    }
                }
                Sources.LineFile lineFile = sources.getLineFile(jsError.lineNumber);
                String msg = formatMessage(lineFile.getFileName(), lineFile.getLine(), jsError.getCharno(), jsError.description);
                if (checkLevel.equals(CheckLevel.WARNING)) {
                    Logger.getLogger(ClosureCompressor.class.getName()).log(Level.WARNING, msg);
                } else if (checkLevel.equals(CheckLevel.ERROR)) {
                    Logger.getLogger(ClosureCompressor.class.getName()).log(Level.SEVERE, msg);
                } else if (checkLevel.equals(CheckLevel.OFF)) {
                    //Logger.getLogger(ClosureCompressor.class.getName()).log(Level.SEVERE, msg);
                    System.out.println("OFF");
                }

            }
        });
        
        opts.setSummaryDetailLevel(0);
        
        // To get the complete set of externs, the logic in
        // CompilerRunner.getDefaultExterns() should be used here.
        SourceFile extern = SourceFile.fromCode("UNKNOWN", "");

        // The dummy input name "input.js" is used here so that any warnings or
        // errors will cite line numbers in terms of input.js.
        SourceFile input = SourceFile.fromCode("...", code);

        // compile() returns a Result, but it is not needed here.
        compiler.compile(extern, input, opts);

        // The compiler is responsible for generating the compiled code; it is not
        // accessible via the Result.
        return compiler.toSource();
    }

    static String formatMessage(String src, int line, int char_no, String desc) {

        return "SRC: " + src + "\n LINE: " + line + ", COL: " + char_no + ", MSG: " + desc;
    }
}
