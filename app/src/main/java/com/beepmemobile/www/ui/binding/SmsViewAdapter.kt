
package com.beepmemobile.www.ui.binding

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.msg.SmsMessage
import com.beepmemobile.www.databinding.SmsReceivedItemBinding
import com.beepmemobile.www.databinding.SmsSentItemBinding
import com.beepmemobile.www.util.Util

class SmsViewAdapter :
    RecyclerView.Adapter<SmsViewAdapter.SmsViewViewHolder>() {

    private var sms_view_list = listOf<SmsMessage>()
    private var app_user: AppUser = AppUser();
    private val util = Util()

    private val SENT_TYPE = 1
    private val RECEIVED_TYPE = 2

    override fun onCreateViewHolder(
        viewGroup: ViewGroup,
        i: Int
    ): SmsViewViewHolder {


        if(i == SENT_TYPE){
            val smsSentItemBinding = SmsSentItemBinding.inflate(LayoutInflater.from(viewGroup.context),
                viewGroup,
                false
            )

            return SmsViewViewHolder(smsSentItemBinding)
        }else{

            val smsReceivedItemBinding = SmsReceivedItemBinding.inflate(LayoutInflater.from(viewGroup.context),
                viewGroup,
                false
            )

            return SmsViewViewHolder(smsReceivedItemBinding)
        }

    }

    override fun onBindViewHolder(
        smsViewViewHolder: SmsViewViewHolder,
        i: Int
    ) {
        val current_sms_msg: SmsMessage = sms_view_list[i]
        smsViewViewHolder.smsSentItemBinding?.sms = current_sms_msg
        smsViewViewHolder.smsReceivedItemBinding?.sms = current_sms_msg
        smsViewViewHolder.smsReceivedItemBinding?.util = util

    }

    override fun getItemViewType(position: Int): Int {

        val currentSmsMsg: SmsMessage = sms_view_list[position]
        if(currentSmsMsg.sender_phone_no == app_user.mobile_phone_no){
            return SENT_TYPE
        }else{
            return RECEIVED_TYPE
        }
    }

    override fun getItemCount(): Int {
           return sms_view_list.size
    }

    fun setSmsViewList(app_user: AppUser, other_user_phone_no: String?, sms_view_list: MutableList<SmsMessage>) {
        this.app_user = app_user

        this.sms_view_list = sms_view_list.filter {
            it.user.mobile_phone_no ==  other_user_phone_no
        }

        notifyDataSetChanged()
    }

    inner class SmsViewViewHolder: RecyclerView.ViewHolder {
        var smsReceivedItemBinding : SmsReceivedItemBinding? = null
        var smsSentItemBinding : SmsSentItemBinding? = null
        constructor(binding: SmsSentItemBinding):super(binding.root){
            smsSentItemBinding = binding
        }

        constructor(binding: SmsReceivedItemBinding):super(binding.root){
            smsReceivedItemBinding = binding
        }
    }

}