package com.beepmemobile.www.data

import android.text.Editable
import java.util.*

abstract class Message{

    companion object {

        val UNKNOWN = 0;
        val MSG_STATUS_NOT_SENT = 1;//not sent
        val MSG_STATUS_SENT = 2;// sent to the server but not to the recipient
        val MSG_STATUS_SEEN = 3;//recipient has seen the message sent to him
        val MSG_STATUS_READ = 4;//recipient has read the message sent to him

    }

    var read_count = 0

    var content : String = ""
    var sender_id: String = ""// will help to retrieve the user object of the sender if a BeepMe member
    var receiver_id: String = ""// will help to retrieve the user object of the receiver if a BeepMe member
    var received_time: Date? = null;
    var sent_time: Date? = null;
    var msg_status: Int = UNKNOWN;

    var type:Int = -1

    var msg_time: Date? = null; // could be sent_time or received_time - determined by the app

    var user = User()// sender

    abstract fun send(text: String)

    fun send(editable: Editable){
        send(editable.toString())
    }

}