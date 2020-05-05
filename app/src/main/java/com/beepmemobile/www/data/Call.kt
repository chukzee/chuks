package com.beepmemobile.www.data

import java.util.*

class Call {

    companion object {

        val UNKNOWN =0;
        val DIALLED_CALL = 1;
        val MISSED_CALL = 2;
        val RECEIVED_CALL = 3;
    }

    var caller_user_id: String = "" // will help to retrieve the user object of the caller if a BeepMe member
    var receiver_user_id: String = ""// will help to retrieve the user object of the receiver if a BeepMe member
    var caller_phone_no: String = ""
    var receiver_phone_no: String = ""
    var call_time: Date = Date()
    var call_duration: Long = 0;// duration in seconds
    var call_type =UNKNOWN; //whether DIALLED, MISSED , RECEIVED

     var user = User()

}