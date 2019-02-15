

var config = require('../../config');
var sharp = require('sharp');


function resizeImage(max_size, input_path, output_path) {
    var sp = sharp(input_path);
    sp.metadata()
            .then(info => {
                var size = info.width < info.height ? info.width : info.height;
                var size = size < max_size ? size : max_size;
                return sp
                        .resize(size)
                        .png()
                        .toFile(output_path);
            })
            .then(data => {
                //do nothing for now
            })
            .catch(err => console.log(err));
}

process.on('message', (msg) => {

    console.log('msg.input_file_path', msg.input_file_path);
    console.log('msg.absolute_small_image_path', msg.absolute_small_image_path);
    console.log('msg.absolute_large_image_path', msg.absolute_large_image_path);

    resizeImage(config.SMALL_IMAGE_SIZE, msg.input_file_path, msg.absolute_small_image_path);
    resizeImage(config.LARGE_IMAGE_SIZE, msg.input_file_path, msg.absolute_large_image_path);

});