package com.beepmemobile.www.data

import android.widget.Switch

class AppUser : User(){

    var favourite_list = mutableSetOf<String>()

    fun isFavourite(user_id: String): Boolean{
        return favourite_list.contains(user_id)
    }

    fun addRemoveFavourite(view: Switch, user_id: String): Unit {

        if(view.isChecked){
            favourite_list.add(user_id)
        }else{
            favourite_list.remove(user_id)
        }

        //TODO - save changes to system
    }

    fun createSms(app_user_phone_no: String, to_user_phone_no: String, show_comfirm_action_dialog: Boolean): Unit {

        if(show_comfirm_action_dialog){
            //TODO show dialog box to confirm action. this may be necessary in some case e.g home screen

        }else{

        }
        //TODO come back for complete implementation
    }

    fun makeCall(app_user_phone_no: String, to_user_phone_no: String, show_comfirm_action_dialog: Boolean): Unit {

        if(show_comfirm_action_dialog){
            //TODO show dialog box to confirm action. this may be necessary in some case e.g home screen

        }else{

        }
        //TODO come back for complete implementation
    }

    fun chat(app_user_id: String, to_user_id: String, show_comfirm_action_dialog: Boolean): Unit {

        if(show_comfirm_action_dialog){
            //TODO show dialog box to confirm action. this may be necessary in some case e.g home screen

        }else{

        }
        //TODO come back for complete implementation
    }

    fun viewProfile(user: User){
        //TODO use navigator to go to the user profile
    }
}