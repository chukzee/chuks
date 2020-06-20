package com.beepmemobile.www.ui.sms

import android.content.Context
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.Message
import com.beepmemobile.www.data.User
import com.beepmemobile.www.data.msg.SmsMessage
import com.beepmemobile.www.ui.main.UserListModel
import me.everything.providers.android.telephony.Sms
import me.everything.providers.android.telephony.TelephonyProvider
import java.util.*

class PhoneSms(private val context: Context, private val app_user : AppUser, private val usersModel: UserListModel) {


    fun getMessages(filter: TelephonyProvider.Filter): MutableList<SmsMessage>{

        val telephonyProvider: TelephonyProvider = TelephonyProvider(context)
        var smsList = telephonyProvider.getSms(filter).list
        var smsMessageList = mutableListOf<SmsMessage>()
        smsList.forEach {
            smsMessageList.add(toSmsMessage(it, filter))
        }

        return smsMessageList
    }

    private fun toSmsMessage(sms: Sms, filter: TelephonyProvider.Filter): SmsMessage {
        var msg = SmsMessage()
        msg.type = filter.ordinal
        msg.subject = sms.subject?:""
        msg.content = sms.body
        msg.sent_time = Date(sms.sentDate)
        msg.received_time = Date(sms.receivedDate)

        if(filter == TelephonyProvider.Filter.INBOX){

            msg.msg_time = Date(sms.receivedDate)
            //get the user from the server or phone contact
            msg.sms_phone_no = sms.address // other user
            msg.sender_id = sms.address // other user
            var unknownUser = User()
            unknownUser.user_id = sms.address
            unknownUser.display_name = sms.address

            msg.user = usersModel.getUser(sms.address)?: unknownUser //come back - NOT SURE IF address is the sender phone number

        }else{//SENT, OUTBOX, DRAFT message type
            msg.msg_time = Date(sms.sentDate)
            msg.sms_phone_no = sms.address // other user
            msg.receiver_id = sms.address // other user
            msg.user = app_user as User
        }

        if(sms.seen) {
            msg.msg_status = Message.MSG_STATUS_SEEN
        }

        if(sms.read) {
            msg.msg_status = Message.MSG_STATUS_READ
        }

        return msg
    }

}