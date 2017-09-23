



Main.on("pagecreate", function (arg) {


    var obj = {
        contact: 'info/Contact',
    };

    Main.rcall.live(obj);
    

    $('#test-simulate-page').on('click', function () {
        //alert('#btn-page1-next');

        Main.page.show({
            url: 'test/simulate/simulate-test-1.html',
            effect: "slideleft",
            duration: 3000,
            data: {game: "testgame"}
        });
    });

    /*
     
        <button id="btn-add" style="margin: 5px;">Add</button>
        <button id="btn-add-bulk" style="margin: 5px;">Add Bulk</button>
        <button id="btn-remove" style="margin: 5px;">Remove</button>
        <button id="btn-remove-bulk" style="margin: 5px;">Remove Bulk</button>
        <button id="btn-set" style="margin: 5px;">Set</button>
     */

    $('#btn-add').on('click', function () {

        var user_id = prompt('user_id', '07032710628');
        var contact_user_id = prompt('contact_user_id', '07032710628');

        Main.ro.contact.add(user_id, contact_user_id)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });

    $('#btn-add-bulk').on('click', function () {

        var user_id = prompt('user_id', '');
        var contacts_user_ids_arr = prompt('enter contacts user ids separated by comma', '');
        if(!contacts_user_ids_arr){
            contacts_user_ids_arr = '';
        }
        contacts_user_ids_arr = contacts_user_ids_arr.split(',');
        
        Main.ro.contact.addBulk(user_id, contacts_user_ids_arr)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });

    $('#btn-remove').on('click', function () {

        var user_id = prompt('user_id', '07032710628');
        var contact_user_id = prompt('contact_user_id', '07032710628');

        Main.ro.contact.remove(user_id, contact_user_id)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });

    $('#btn-remove-bulk').on('click', function () {

        var user_id = prompt('user_id', '');
        var contacts_user_ids_arr = prompt('enter contacts user ids separated by comma', '');
        if(!contacts_user_ids_arr){
            contacts_user_ids_arr = '';
        }
        contacts_user_ids_arr = contacts_user_ids_arr.split(',');
        
        Main.ro.contact.removeBulk(user_id, contacts_user_ids_arr)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });

    $('#btn-set').on('click', function () {

        var user_id = prompt('user_id', '');
        var contacts_user_ids_arr = prompt('enter contacts user ids separated by comma', '');
        if(!contacts_user_ids_arr){
            contacts_user_ids_arr = '';
        }
        contacts_user_ids_arr = contacts_user_ids_arr.split(',');
        
        Main.ro.contact.set(user_id, contacts_user_ids_arr)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });

});