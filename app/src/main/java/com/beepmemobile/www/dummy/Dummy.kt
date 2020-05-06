package com.beepmemobile.www.dummy

import com.beepmemobile.www.data.Call
import com.beepmemobile.www.data.Message
import com.beepmemobile.www.data.User
import com.beepmemobile.www.data.msg.ChatMessage
import com.beepmemobile.www.data.msg.Contact
import com.beepmemobile.www.data.msg.Post
import com.beepmemobile.www.data.msg.SmsMessage
import com.beepmemobile.www.ui.main.MainViewModel
import java.util.*
import kotlin.random.Random

class Dummy {

    private val dummy_suffix = 0;

    fun getTestCallInfoList(count: Int): MutableList<Call> {
       var list = mutableListOf<Call>();

        for (i in dummy_suffix..count + dummy_suffix){
            var obj = Call()

            obj.call_time = Date()

            var rand_type = Random.nextInt(1, 3) + 1
            obj.call_type = rand_type;

            obj.caller_phone_no = "080" + (10000000 + i)
            obj.caller_user_id = "user_id_" + dummy_suffix

            if(obj.call_type == Call.RECEIVED_CALL) {
                obj.call_duration = i + 10L;
            }

            if(obj.call_type == Call.RECEIVED_CALL || obj.call_type == Call.MISSED_CALL) {
                obj.receiver_phone_no = "090" + (10000000 + i)
                obj.receiver_user_id = " user_id_" + dummy_suffix +1
            }

            list.add(obj)//make sure to set caller phone number as the map key
        }

        return list;
    }

    fun getTestUserList(count: Int): MutableList<User> {
        var list = mutableListOf<User>();


        for (i in dummy_suffix..count + dummy_suffix){
            var obj = User()
            obj.user_id  = "user_id_"+ i
            obj.first_name = "first_name_"+i
            obj.last_name = "last_name_"+i
            obj.address = "No. " + i + " along Road_"+i +" off Place_"+i+" Ekpan, Delta "
            obj.photo_url ="photo_url_"+i
            obj.email = "email_"+i+"4u@gmail.com"
            obj.phone_no =  "070" + (10000000 + i)

            list.add(obj)
        }

        return list;
    }

    fun getTestContactList(count: Int): MutableList<Contact> {
        var list = mutableListOf<Contact>();

        for (i in dummy_suffix..count + dummy_suffix){
            var obj = Contact()
            obj.user_id  = "user_id_"+ i
            obj.first_name = "first_name_"+i
            obj.last_name = "last_name_"+i
            obj.address = "No. " + i + " along Road_"+i +" off Place_"+i+" Ekpan, Delta "
            obj.photo_url ="photo_url_"+i
            obj.email = "email_"+i+"4u@gmail.com"
            obj.phone_no =  "070" + (10000000 + i)

            list.add(obj)
        }

        return list;
    }

    fun getTestChatMessageList(count: Int): MutableList<ChatMessage> {
        var list = mutableListOf<ChatMessage>();

        for (i in dummy_suffix..count + dummy_suffix){
            var obj = ChatMessage()

            obj.content = this.randomDummyWord("ChatWord")
            obj.msg_time = Date()

            obj.msg_status = Random.nextInt(1, 4)  + 1

            obj.sender_id = "user_id_"+ i

            if(Message.MSG_STATUS_DELIVERED ==  obj.msg_status || Message.MSG_STATUS_SEEN ==  obj.msg_status ) {
                obj.receiver_id = "user_id_" + i + 1
            }

            if(Message.MSG_STATUS_DELIVERED ==  obj.msg_status
                || Message.MSG_STATUS_SEEN ==  obj.msg_status
                || Message.MSG_STATUS_SENT ==  obj.msg_status ) {
                obj.msg_time = Date()
            }

            list.add(obj)
        }

        return list;
    }

    fun getTestSmsMessageList(count: Int): MutableList<SmsMessage> {
        var list = mutableListOf<SmsMessage>();

        for (i in dummy_suffix..count + dummy_suffix){
            var obj = SmsMessage()

            obj.content = this.randomDummyWord("PostWord")
            obj.msg_time = Date()

            obj.msg_status = Random.nextInt(1, 4)  + 1

            obj.sender_id = "user_id_"+ dummy_suffix
            obj.sender_phone_no = "080" + (10000000 + i)


            if(Message.MSG_STATUS_DELIVERED ==  obj.msg_status || Message.MSG_STATUS_SEEN ==  obj.msg_status ) {
                obj.receiver_id = "user_id_" + dummy_suffix + 1
                obj.receiver_phone_no = "090" + (10000000 + i)
            }

            if(Message.MSG_STATUS_DELIVERED ==  obj.msg_status
                || Message.MSG_STATUS_SEEN ==  obj.msg_status
                || Message.MSG_STATUS_SENT ==  obj.msg_status ) {
                obj.msg_time = Date()
            }

            list.add(obj)
        }

        return list;
    }

    fun getTestPostList(count: Int): MutableList<Post> {
        var list = mutableListOf<Post>();


        for (i in dummy_suffix..count + dummy_suffix){
            var obj = Post()

            obj.content = this.randomDummyWord("SmsWord")
            obj.msg_time = Date()

            obj.msg_status = Random.nextInt(1, 4)  + 1

            obj.sender_id = "user_id_"+ i

            if(Message.MSG_STATUS_DELIVERED ==  obj.msg_status
                || Message.MSG_STATUS_SENT ==  obj.msg_status ) {
                obj.msg_time = Date()
            }

            list.add(obj)
        }

        return list;
    }

    private fun randomDummyWord(prefix: String): String{
        var text = ""
        var start = 1;
        var end = Random.nextInt(start , 10);

        for(i in start..end){
            text += prefix + i +" ";
        }

        return text.trim();
    }

    fun signUp(): MainViewModel.Result {
        var r = MainViewModel.Result()

        r.success = true

        var i = dummy_suffix

        r.auth_user.user_id  = "user_id_"+ i
        r.auth_user.first_name = "first_name_"+i
        r.auth_user.last_name = "last_name_"+i
        r.auth_user.address = "No. " + i + " along Road_"+i +" off Place_"+i+" Ekpan, Delta "
        r.auth_user.photo_url ="photo_url_"+i
        r.auth_user.phone_no =  "070" + (10000000 + i)
        r.auth_user.email = "email_"+i+"4u@gmail.com"
        return r

    }
}