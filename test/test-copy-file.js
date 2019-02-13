
var fs = require('fs');


function promiseCopyFile(from, to) {
    return new Promise((resolve, reject) => {
        fs.copyFile(from, to, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

    function promiseRenameFile(from, to) {
        return new Promise((resolve, reject) => {
            fs.rename(from, to, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

var small_image_path = 'C:\\Users\\HP-PC\\Documents\\NetBeansProjects\\Game9ja\\public\\www\\uploads\\images\\small\\group\\group01.png';
var large_image_path = 'C:\\Users\\HP-PC\\Documents\\NetBeansProjects\\Game9ja\\public\\www\\uploads\\images\\large\\group\\group01.png';

var from_tmp = 'C:\\Users\\HP-PC\\AppData\\Local\\Temp\\upload_eb28f658f61f1850625c365246697705';


promiseCopyFile(from_tmp, large_image_path)
        .then(() => {
            return promiseRenameFile(from_tmp, small_image_path);
        })
        .then(() => {
            /*result.success = true;
             result.small_image_path = small_image_path;
             result.large_image_path = large_image_path;
             this.nextResizer().send(result);
             res.send(JSON.stringify(result));*/
        })
        .catch(err => {
            console.log(err);
            /*return res.send(JSON.stringify(result));*/
        });

    