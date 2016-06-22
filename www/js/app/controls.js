/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var ChurchApp = new ChurchApp();

function onRegisterParishHeadOf(e) {

    switch ($(e).val()) {
        case "":
            {
                $("#register-parish-division-name-cont").hide();
                $("#register-parish-division-name").val("");

                $("#register-parish-under-area-cont").show();
                $("#register-parish-under-zone-cont").show();
                $("#register-parish-under-province-cont").show();
                $("#register-parish-under-region-cont").show();
                $("#register-parish-under-national-cont").show();
            }
            break;
        case "Area":
            {
                $("#register-parish-division-name-cont").show();
                
                $("#register-parish-under-area-cont").show();
                $("#register-parish-under-zone-cont").show();
                $("#register-parish-under-province-cont").show();
                $("#register-parish-under-region-cont").show();
                $("#register-parish-under-national-cont").show();
            }
            break;
        case "Zone":
            {
                $("#register-parish-division-name-cont").show();
                
                $("#register-parish-under-area-cont").hide();
                $("#register-parish-under-area").val("");
                
                $("#register-parish-under-zone-cont").show();                
                $("#register-parish-under-province-cont").show();
                $("#register-parish-under-region-cont").show();
                $("#register-parish-under-national-cont").show();
            }
            break;
        case "Province":
            {
                $("#register-parish-division-name-cont").show();
                
                $("#register-parish-under-area-cont").hide();
                $("#register-parish-under-area").val("");
                
                $("#register-parish-under-zone-cont").hide();
                $("#register-parish-under-zone").val("");
                
                $("#register-parish-under-province-cont").show();                
                $("#register-parish-under-region-cont").show();
                $("#register-parish-under-national-cont").show();
            }
            break;
        case "Region":
            {
                $("#register-parish-division-name-cont").show();
                
                $("#register-parish-under-area-cont").hide();
                $("#register-parish-under-area").val("");
                
                $("#register-parish-under-zone-cont").hide();
                $("#register-parish-under-zone").val("");
                
                $("#register-parish-under-province-cont").hide();
                $("#register-parish-under-province").val("");
                
                $("#register-parish-under-region-cont").show();                
                $("#register-parish-under-national-cont").show();
            }
            break;
        case "National":
            {
                $("#register-parish-division-name-cont").show();
                
                $("#register-parish-under-area-cont").hide();
                $("#register-parish-under-area").val("");
                
                $("#register-parish-under-zone-cont").hide();
                $("#register-parish-under-zone").val("");
                
                $("#register-parish-under-province-cont").hide();
                $("#register-parish-under-province").val("");
                
                $("#register-parish-under-region-cont").hide();
                $("#register-parish-under-region").val("");
                
                $("#register-parish-under-national-cont").show();
            }
            break;
    }
}

function createInnerComponent(e, id_suffix) {

    var title;
    var compFeatures;

    switch (id_suffix) {
        case "accountant":
            {
                title = "Accountant Access Control";
                compFeatures = ChurchApp.userPivilegeFeatures["accountant"];
            }
            break;
        case "admin":
            {
                title = "Admin Access Control";
                compFeatures = ChurchApp.userPivilegeFeatures["admin"];

            }
            break;
        case "pastor":
            {
                title = "Pastor Access Control";
                compFeatures = ChurchApp.userPivilegeFeatures["pastor"];
            }
            break;
        case "worker":
            {
                title = "Worker Access Control";
                compFeatures = ChurchApp.userPivilegeFeatures["worker"];
            }
            break;
        case "men_exco":
            {
                title = "Men Exco Access Control";
                compFeatures = ChurchApp.userPivilegeFeatures["men_exco"];
            }
            break;
        case "women_exco":
            {
                title = "Women Exco Access Control";
                compFeatures = ChurchApp.userPivilegeFeatures["women_exco"];
            }
            break;
        case "youth_exco":
            {
                title = "Youth Exco Access Control";
                compFeatures = ChurchApp.userPivilegeFeatures["youth_exco"];
            }
            break;
        case "member":
            {
                title = "Member Access Control";
                compFeatures = ChurchApp.userPivilegeFeatures["member"];
            }
            break;
        case "children":
            {
                title = "Children Access Control";
                compFeatures = ChurchApp.userPivilegeFeatures["children"];
            }
            break;
    }

    if (e.checked) {
        // perform operation for checked
        var content = featureInnerContent(title, id_suffix, compFeatures);
        $("#authorization_features").prepend(content).trigger('create');
        //remove previous click events for purpose of overiding when we add below
        for(var i=0; i<compFeatures.length; i++){
            $('#authorization_features  [name="'+compFeatures[i].feature+'"]').off('click');
        }
        
        //add click events.
        for(var i=0; i<compFeatures.length; i++){
            $('#authorization_features  [name="'+compFeatures[i].feature+'"]').on('click',function(){                
                //enable/disable user features
                for(var k=0; k<compFeatures.length; k++){
                    if(compFeatures[k].feature === $(this).attr("name")){
                       compFeatures[k].enabled = $(this).is(":checked"); 
                    }
                }
            });
        }
    }
    else {
        // perform operation for unchecked
        var div_id = createAuthorizationFeaturesId(id_suffix);
        $('#' + div_id).remove();
    }
}

function createAuthorizationFeaturesId(id_suffix) {
    return "authorization_features_" + id_suffix;
}

function featureInnerContent(desc, id_suffix, arrFeature) {

    var div_id = createAuthorizationFeaturesId(id_suffix);

    var html = '<div data-role="collapsible" id="' + div_id + '" ><h3>' + desc + '</h3>';
    html += '<div data-role="controlgroup">';

    for (var i = 0; i < arrFeature.length; i++) {
        var descNameWithoutSpace = ChurchApp.Util.replaceAllChar(arrFeature[i].feature, " ", "_");
        var id = div_id + "_" + descNameWithoutSpace;
        var checked = "";
        if (arrFeature[i].enabled) {
            checked = "checked";
        }

        html += '<label for="' + id + '">' + arrFeature[i].feature + '</label>';
        html += '<input name="' + arrFeature[i].feature + '" id="' + id + '" ' + checked + ' type="checkbox">';
    }

    html += "</div>";
    html += "</div>";
    return html;
}