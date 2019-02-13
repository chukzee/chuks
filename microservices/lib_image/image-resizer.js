

var config = require('../../config');
var sharp = require('sharp');


function resizeImage(max_size, path) {
    sharp(path)
            .metadata()
            .then(info => {
                var size = info.width < info.height ? info.width : info.height;
                var size = size < max_size ? size : max_size;
                return sharp
                        .resize(max_size)
                        .png()
                        .toFile(path);
            })
            .then(data => {
                //do nothing for now
            })
            .catch(err => console.log(err));
}

process.on('message', (msg) => {
    try {

        var obj = JSON.parse(msg);

        resizeImage(config.SMALL_IMAGE_SIZE, obj.small_image_path);
        resizeImage(config.LARGE_IMAGE_SIZE, obj.large_image_path);
    } catch (e) {
        console.log(e);
    }


});