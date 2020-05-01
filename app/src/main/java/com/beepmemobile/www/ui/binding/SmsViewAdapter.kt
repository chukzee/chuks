
package com.beepmemobile.www.ui.binding

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.msg.SmsMessage
import com.beepmemobile.www.databinding.SmsReceivedItemBinding
import com.beepmemobile.www.databinding.SmsSentItemBinding

class SmsViewAdapter :
    RecyclerView.Adapter<SmsViewAdapter.SmsViewViewHolder>() {

    private var sms_view_list = mutableListOf<SmsMessage>()
    private var app_user: AppUser = AppUser();

    override fun onCreateViewHolder(
        viewGroup: ViewGroup,
        i: Int
    ): SmsViewViewHolder {

        val currentSmsMsg: SmsMessage = sms_view_list[i]

        if(currentSmsMsg.sender_phone_no == app_user.phone_no){
            val smsSentItemBinding = SmsSentItemBinding.inflate(LayoutInflater.from(viewGroup.context),
                viewGroup,
                false
            )

            return SmsViewViewHolder(smsSentItemBinding)
        }
        else{

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
        smsViewViewHolder.smsSentItemBinding.sms = current_sms_msg
        smsViewViewHolder.smsReceivedItemBinding.sms = current_sms_msg

    }

    override fun getItemCount(): Int {
           return sms_view_list.size
    }

    fun setSmsViewList(app_user: AppUser, sms_view_list: MutableList<SmsMessage>) {
        this.app_user = app_user
        this.sms_view_list = sms_view_list
        notifyDataSetChanged()
    }

    inner class SmsViewViewHolder: RecyclerView.ViewHolder {
        lateinit var smsReceivedItemBinding : SmsReceivedItemBinding
        lateinit var smsSentItemBinding : SmsSentItemBinding
        constructor(binding: SmsSentItemBinding):super(binding.root){
            smsSentItemBinding = binding
        }

        constructor(binding: SmsReceivedItemBinding):super(binding.root){
            smsReceivedItemBinding = binding
        }
    }

}