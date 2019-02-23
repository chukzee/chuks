

var config = require('../../config');
//var sharp = require('sharp');//@deprecated - since it has too limited format support - we now use GraphicMagik instead

var gm = require('gm');

function resizeImage(max_size, input_path, output_path) {

    var g = gm(input_path);

    g.size((err, sz) => {
        if (err) {
            console.log(err);
            return;
        }

        var img_size = sz.width < sz.height ? sz.width : sz.height;
        var img_size = img_size < max_size ? img_size : max_size;

        g.resizeExact(img_size, img_size)
                .setFormat(config.IMAGE_FORMAT)
                .write(output_path, function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                });
    });
}

process.on('message', (msg) => {

    //console.log('msg.input_file_path', msg.input_file_path);
    //console.log('msg.absolute_small_image_path', msg.absolute_small_image_path);
    //console.log('msg.absolute_large_image_path', msg.absolute_large_image_path);

    resizeImage(config.SMALL_IMAGE_SIZE, msg.input_file_path, msg.absolute_small_image_path);
    resizeImage(config.LARGE_IMAGE_SIZE, msg.input_file_path, msg.absolute_large_image_path);

});