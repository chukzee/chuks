

var execSync = require('child_process').execSync;

//windows
var cmd = "wmic csproduct get uuid";
var options = {};//come back
var str = execSync(cmd, options);
var split = str.toString().trim().split(" ");
var id = '';
var arr = [];
for (var i = 0; i < split.length; i++) {
    var s = split[i].trim();
    if (s) {
        arr.push(s);
    }
}

id = arr[arr.length - 1];//last in the array
console.log(id);

console.log('a=b'.split('a=')[1]);
console.log(process.platform);


function getMachineID(cmd, marker) {
    var os_id = '';
    try {

        var options = {encoding: 'utf8'};
        var str = execSync(cmd, options);        
        var split = str.toString().trim().split("\n");
        var arr = [];
        for (var i = 0; i < split.length; i++) {
            var s = split[i].trim();
            if (s) {
                arr.push(s);
            }
        }
        for(var i=0; i<arr.length; i++){
            if(arr[i]===marker){
                return arr[i+1].trim();
            }else if(arr[i].startsWith(marker)){
                return arr[i].substring(marker.length).trim();
            }
        }
    } catch (e) {
        console.log(e);
    }

    return os_id;
}

console.log(getMachineID('wmic bios get serialnumber', 'SerialNumber'));

console.log('Detected task that was not created in the server machine.\nDo you want to run?');



