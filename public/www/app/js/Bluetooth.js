
/* global Main, Ns */

Ns.Bluetooth = {

    start: function (obj) {

        var container = obj.container;
        if (Main.util.isString(obj.container)) {
            var cid = obj.container.charAt(0) === '#' ? obj.container.substring(1) : obj.container;
            container = document.getElementById(cid);
        }

        if (!container) {
            console.warn('bluetooth dialog container is null or unknown id - ', obj.container);
            return;
        }

        if (!Main.util.isFunc(obj.onReady)) {
            console.warn('bluetooth onReady not a function!');
            return;
        }
        
        container.style.position = 'relative';
        container.style.width = '100%';
        container.style.height = '100%';
        
        
        var div1 = document.createElement('div');
            //div1.style.background = 'blue';
            div1.style.width = '100%';
            div1.style.height = '25px';
            
        var PLAY = 'Play';
        
        var el_selected_info = document.createElement('div');
        el_selected_info.innerHTML = '&nbsp;';
        el_selected_info.style.width = '50%';
        el_selected_info.style.overflow = 'hidden';
        el_selected_info.style.textOverflow = 'ellipsis';
        el_selected_info.style.whiteSpace = 'nowrap';
        
        
        var el_action = document.createElement('input');
        el_action.type = 'button';
        el_action.value = 'Not ready'; // changes to 'Play' when ready 
        el_action.style.display = 'none';//initially hidden
        el_action.style.position = 'absolute';
        el_action.style.top = '0px';
        el_action.style.right = '5px';
        el_action.style.background = 'transparent';
        el_action.style.outline = 'none';
        el_action.style.border = 'none';
        el_action.style.cursor = 'pointer';
        
        div1.appendChild(el_selected_info);
        div1.appendChild(el_action);

        var el_result = document.createElement('div');
        el_result.innerHTML = 'Searching...';

        var device_lst_container_id = 'bluetooth-dialog-devices-found-list';

        var el_devices = document.createElement('div');
        el_devices.id = device_lst_container_id;
        
        container.appendChild(div1);
        container.appendChild(el_result);
        container.appendChild(el_devices);


        var conn_data;
        Main.dom.addListener(el_action, 'click', function (evt) {
            if (el_action.value === PLAY) {
                obj.onReady(conn_data);
            }
        }, false);

        Main.listview.create({
            container: '#' + device_lst_container_id,
            scrollContainer: '#' + device_lst_container_id,
            tplUrl: 'bluetooth-devices-tpl.html',
            wrapItem: false,
            onSelect: function (evt, data) {

                el_selected_info.innerHTML = data.device_name;
                el_action.value = 'Connecting...';
                el_action.style.display = 'block';

                connectToDevice(data, function (data) {
                    conn_data = data;
                    el_action.value = PLAY;
                });

            },
            onReady: function () {
                findDevices(this, el_result);
            }
        });


        function connectToDevice(data, callback) {

            simulateConnect(data, callback);//TESTING!!! TO BE REMOVE

            console.log('Not yet implemented - connectToDevice');
        }


        function findDevices(list, el_result) {

            simulateFindDevice(list, el_result); //TESTING!!! - TO BE REMOVED


            console.log('Not yet implemented - findDevices');

        }


        function simulateFindDevice(list, el_result) {

            for (var i = 0; i < 5; i++) {
                var data = {
                    device_name: 'device_' +'device_' +'device_' + i,
                };

                window.setTimeout(function () {
                    list.appendItem(this.data);
                    el_result.innerHTML = "Devices found : " + this.count;
                }.bind({data: data, count: i+1}), i * 1000);
            }

        }

        function simulateConnect(data, callback) {
            window.setTimeout(function () {
                callback(data);
            }, 5000);
        }

        console.log('Not fully implemented - Ns.Bluetooth.start');

        return true;
    }
};