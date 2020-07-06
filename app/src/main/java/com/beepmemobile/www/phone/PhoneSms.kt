package com.beepmemobile.www.phone

import android.content.Context
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.Message
import com.beepmemobile.www.data.User
import com.beepmemobile.www.data.msg.SmsMessage
import com.beepmemobile.www.ui.main.UserListModel
import com.beepmemobile.www.util.Util
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

        var phoneNo = Util.reformPhoneNumber(context, sms.address)
        val numberE164 = phoneNo.numberE164

        msg.type = filter.ordinal
        msg.subject = sms.subject?:""
        msg.content = sms.body
        msg.sent_time = Date(sms.sentDate)
        msg.received_time = Date(sms.receivedDate)

        var unknownUser = User()
        unknownUser.user_id = numberE164
        unknownUser.display_name = sms.address

        if(filter == TelephonyProvider.Filter.INBOX){

            msg.msg_time = if(sms.receivedDate != 0L) Date(sms.receivedDate) else Date(sms.sentDate)
            msg.sms_phone_no = sms.address // other user
            msg.sender_id = numberE164 // other user

            //get the user from the server or phone contact
            msg.user = usersModel.getUser(numberE164)?: unknownUser //other user

        }else{//SENT, OUTBOX, DRAFT message type

            msg.msg_time = if(sms.sentDate != 0L) Date(sms.sentDate) else Date(sms.receivedDate)
            msg.sms_phone_no = sms.address // other user
            msg.receiver_id = numberE164 // other user

            //get the user from the server or phone contact
            msg.user = usersModel.getUser(numberE164)?: unknownUser //other user
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