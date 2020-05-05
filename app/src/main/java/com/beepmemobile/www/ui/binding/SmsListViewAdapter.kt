package com.beepmemobile.www.ui.binding

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.msg.SmsMessage
import com.beepmemobile.www.databinding.SmsListItemBinding

class SmsListViewAdapter  :
    RecyclerView.Adapter<SmsListViewAdapter.SmsListViewViewHolder>(){
    private var sms_list_view_list = listOf<SmsMessage> ()
    private var app_user: AppUser = AppUser();

    override fun onCreateViewHolder(
        viewGroup: ViewGroup,
        i: Int
    ): SmsListViewViewHolder {

        val smsListItemBinding = SmsListItemBinding.inflate(
            LayoutInflater.from(viewGroup.context),
            viewGroup,
            false)

        return SmsListViewViewHolder(
            smsListItemBinding
        )
    }

    override fun onBindViewHolder(
        smsListViewViewHolder: SmsListViewViewHolder,
        i: Int
    ) {
        val currentSms: SmsMessage = sms_list_view_list[i]
        smsListViewViewHolder.smsListItemBinding.sms = currentSms
    }

    override fun getItemCount(): Int {
        return sms_list_view_list.size
    }

    fun setSmsListViewList(app_user: AppUser, sms_list_view_list: MutableList<SmsMessage>) {
        this.app_user = app_user
        this.sms_list_view_list = sms_list_view_list
        notifyDataSetChanged()
    }

    inner class SmsListViewViewHolder(binding: SmsListItemBinding) :
        RecyclerView.ViewHolder(binding.root) {
        val smsListItemBinding: SmsListItemBinding = binding
    }
}