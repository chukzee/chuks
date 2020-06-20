package com.beepmemobile.www.dummy

import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.Call
import com.beepmemobile.www.data.Message
import com.beepmemobile.www.data.User
import com.beepmemobile.www.data.msg.ChatMessage
import com.beepmemobile.www.data.msg.Post
import com.beepmemobile.www.data.msg.SmsMessage
import com.beepmemobile.www.ui.main.MainViewModel
import java.util.*


class Dummy {

    private val dummy_suffix = 0;

    fun getDummyAppUser(): AppUser{
        var u = AppUser()
         u = createUser(dummy_suffix, u) as AppUser
         u.joined_date = null // make it unregistered
        return u
    }

    fun createUser(i: Int): User{
        var obj = User()
        return createUser(i, obj)
    }

    fun createUser(i: Int, obj :User): User{

        obj.user_id  = "080" + (10000000 + i)
        obj.joined_date = Date()
        obj.display_name = "Person Name_"+i
        obj.home_address = "No. " + i + " along Road_"+i +" off Place_"+i+" Ekpan, Delta"
        obj.office_address = "No. " + i + "Airport Road, Delta"
        obj.photo_url ="photo_url_"+i
        obj.personal_email = "persona_email_"+i+"4u@gmail.com"
        obj.work_email = "work_email_"+i+"4u@beepme.com"
        obj.website = "www.mywebsite"+i+".com"
        obj.location = "Warri, Nigeria "+i
        obj.status_message = "This is my status message "+i
        //obj.mobile_phone_no =  "070" + (10000000 + i)
        obj.work_phone_no =  "071" + (22200000 + i)

        return obj
    }

    fun getTestCallInfoList(count: Int): MutableList<Call> {
       var list = mutableListOf<Call>();

        for (i in dummy_suffix..count - 1 + dummy_suffix){
            var obj = Call()

            obj.time = Date()

            var rand_type = (1..3).random()
            obj.type = rand_type;

            obj.call_id = "080" + (10000000 + i)

            if(obj.type == Call.RECEIVED_CALL) {
                obj.duration = i + 10L;
            }

            if(obj.type == Call.RECEIVED_CALL || obj.type == Call.MISSED_CALL) {
                obj.call_id = "080" + (10000000 + i)
                obj.user = createUser(dummy_suffix + 1, obj.user)
            }else if(obj.type == Call.DIALLED_CALL){
                obj.call_id = "080" + (10000000 + i)
                obj.user = createUser(dummy_suffix, obj.user)
            }

            list.add(obj)//make sure to set caller phone number as the map key
        }

        return list;
    }

    fun getTestUserList(count: Int): MutableList<User> {
        var list = mutableListOf<User>();

        for (i in dummy_suffix..count - 1 + dummy_suffix){

            val obj = createUser(i)

            list.add(obj)
        }

        return list;
    }


    fun getTestChatMessageList(count: Int): MutableList<ChatMessage> {
        var list = mutableListOf<ChatMessage>();

        for (n in dummy_suffix..count - 1 + dummy_suffix){
            var i = n

            var obj = ChatMessage()

            obj.content = this.randomDummyWord("ChatWord")
            obj.received_time = Date()

            obj.msg_status = (1..4).random()

            if(i% 2 == 0 && obj.msg_status != Message.MSG_STATUS_NOT_SENT){
                i = dummy_suffix // app user

                obj.sender_id = "user_id_"+ i//app user
                obj.receiver_id = "user_id_" + i + 1// other user

            }else{
                i = (dummy_suffix+1 .. dummy_suffix+5).random() // other user

                obj.sender_id = "user_id_"+ i// other user
                obj.receiver_id = "user_id_" + dummy_suffix//app user
            }

            obj.user = createUser(i, obj.user)


            if(Message.MSG_STATUS_SEEN ==  obj.msg_status
                || Message.MSG_STATUS_READ ==  obj.msg_status
                || Message.MSG_STATUS_SENT ==  obj.msg_status ) {
                obj.received_time = Date(Date().time - (10 *1000) * n)
            }

            list.add(obj)
        }

        return list;
    }

    fun getTestSmsMessageList(count: Int): MutableList<SmsMessage> {
        var list = mutableListOf<SmsMessage>();

        for (n in dummy_suffix..count - 1 + dummy_suffix){
            var i = n
            var obj = SmsMessage()

            obj.content = this.randomDummyWord("SmsWord")
            obj.received_time = Date()

            obj.msg_status = (1..4).random()

            if(i% 2 == 0 && obj.msg_status != Message.MSG_STATUS_NOT_SENT){
                i = dummy_suffix//app user

                obj.sender_id = "080" + (10000000 + i)//app user
                obj.receiver_id = "090" + (10000000 + i + 1)// other user
            }else{
                i = (dummy_suffix+1 .. dummy_suffix+5).random() // other user

                obj.sender_id = "080" + (10000000 + i)// other user
                obj.receiver_id = "090" + (10000000 + dummy_suffix)//app user
            }

            obj.user = createUser(i, obj.user)


            if(Message.MSG_STATUS_SEEN ==  obj.msg_status
                || Message.MSG_STATUS_READ ==  obj.msg_status
                || Message.MSG_STATUS_SENT ==  obj.msg_status ) {
                obj.received_time = Date(Date().time - (10 *1000) * n)
            }

            list.add(obj)
        }

        return list;
    }

    fun getTestPostList(count: Int): MutableList<Post> {
        var list = mutableListOf<Post>();


        for (n in dummy_suffix..count - 1 + dummy_suffix){
            var i = n

            var obj = Post()
            obj.content = this.randomDummyWord("PostWord")
            obj.received_time = Date()

            obj.msg_status = (1..4).random()

            if(i% 2 == 0 && obj.msg_status != Message.MSG_STATUS_NOT_SENT){
                i = dummy_suffix//app user

                obj.sender_id = "user_id_"+ i//app user
                obj.receiver_id = "user_id_" + i + 1// other user
            }else{
                i = (dummy_suffix+1 .. dummy_suffix+5).random() // other user

                obj.sender_id = "user_id_"+ i// other user
                obj.receiver_id = "user_id_" + dummy_suffix//app user
            }

            obj.user = createUser(i, obj.user)

            if(Message.MSG_STATUS_SEEN ==  obj.msg_status
                || Message.MSG_STATUS_SENT ==  obj.msg_status ) {
                obj.received_time = Date(Date().time - (10 *1000) * n)
            }

            list.add(obj)
        }

        return list;
    }

    private fun randomDummyWord(prefix: String): String{
        var text = ""
        var start = 1;
        var end = (1..10).random();

        for(i in start..end){
            text += prefix + i +" ";
        }

        return text.trim();
    }

    fun signUp(): MainViewModel.Result {
        var r = MainViewModel.Result()

        r.success = true

        r.auth_user  = createUser(dummy_suffix, r.auth_user) as AppUser

        return r

    }
}