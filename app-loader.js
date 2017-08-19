
/*The module automatically searches and loads all the exported classes define in the app folder
 * 
 * Note that for this module to load these exported classes the follow must be met:
 * 
 * 1. The class must be defined in a file stored within the app folder
 * 2. The class definition must follow the ES6 standard definition of classes.
 * 3. The class itself must be exported and not the instance (object) of the class
 * 
 * 
 */

var APP_DIR = "app";
var app_loc = (__dirname.endsWith("/") ? __dirname : __dirname + "/") + APP_DIR + "/";

var requireMod = {};

function getExportedClass (str){
    var s = new String(str);
    s = s.trim();
    s = s.replace("{", " ");
    
    while(true){
        var s1 = s.replace("  ", " ");
            s1 = s1.replace("\r", " ");
            s1 = s1.replace("\n", " ");
            
        if(s1 !== s){
            s = s1;
        }else{
            break;
        }
    }
    
    var sp = s.split(" ");
    if(sp[0]==="class" && sp[1]){
        
        return sp[1];
    }else{
        return null;
    }
}

// require all files in the app directory recursively in a synchronous fashion
(function walkSync(dir, filelist) {
    var fs = fs || require('fs'),
            files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {

        if (fs.statSync(dir + file).isDirectory()) {
            
            filelist = walkSync(dir + file + '/', filelist);
        } else {
            
            var mod = require(dir + file);
            
            if (typeof mod === "function") {
                
                var clazz = getExportedClass (mod.toString());
                if(clazz){
                    var sub_dir = dir.substring(app_loc.length);
                    requireMod[sub_dir + clazz] = mod;
                    
                    //console.log(sub_dir);
                    console.log(sub_dir + clazz);
                }
                
                
                console.log(file);                
                //console.log(requireMod[APP_DIR + "/" + file].toString());

                filelist.push(file);
            }
        }


    });
    return filelist;
})(app_loc);


module.exports = function(){
    
    /*
     * @Deprecated
     * 
     * for(var i in requireMod){
     * //No no no! Dont because of thread issue 
     * //even though it is widely believed node is thread safe.
     * //Have you thought of asyn operation and how it
     * //may cause unexpected result if we make 'requireMod' variable
     * //have static access? There could be thread issues i strongly believe.
     * //Thus, we will rather instantiate on demand. Caution is the word here!
     * 
        requireMod[i] =new requireMod[i](app); // we shall later instantiate on demand! see reason directly above 
    }*/
    
    
    
    /*
     * 
     */
    this.getModule = function(qualifiedClassName){
        return requireMod[qualifiedClassName];
    };
    
    return this;
};
