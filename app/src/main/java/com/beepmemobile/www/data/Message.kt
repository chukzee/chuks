package com.beepmemobile.www.data

import java.util.*

abstract class Message{

    companion object {

        val UNKNOWN = 0;
        val MSG_STATUS_NOT_SENT = 1;//not sent
        val MSG_STATUS_SENT = 2;// sent to the server but not to the recipient
        val MSG_STATUS_DELIVERED = 3;//sent to the recipient by the server but not sure if he has seen it
        val MSG_STATUS_SEEN = 4;//recipient has seen the message sent to him

    }

    var content : String = ""
    var sender_id: String = ""// will help to retrieve the user object of the sender if a BeepMe member
    var receiver_id: String = ""// will help to retrieve the user object of the receiver if a BeepMe member
    var msg_time: Date = Date();
    var msg_status: Int = UNKNOWN;

    var user = User()

    open fun send(text: String){

    }
}