package com.beepmemobile.www.ui.binding

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.NavController
import androidx.navigation.NavDirections
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.User
import com.beepmemobile.www.data.msg.SmsMessage
import com.beepmemobile.www.databinding.ListSubHeaderBinding
import com.beepmemobile.www.databinding.SmsListItemBinding
import com.beepmemobile.www.ui.sms.SmsListViewFragmentDirections
import com.beepmemobile.www.util.Util

class SmsListViewAdapter(navCtrlr: NavController)  :
    RecyclerView.Adapter<SmsListViewAdapter.SmsListViewViewHolder>(){
    private val navController = navCtrlr
    private var sms_list_view_list = listOf<SmsMessage> ()
    private var app_user: AppUser = AppUser();
    private val util = Util()

    override fun onCreateViewHolder(
        viewGroup: ViewGroup,
        i: Int
    ): SmsListViewViewHolder {

        val smsListItemBinding = SmsListItemBinding.inflate(
            LayoutInflater.from(viewGroup.context),
            viewGroup,
            false)

        var sms = sms_list_view_list[i]
        smsListItemBinding.root.setOnClickListener(SmsItemListener(sms))

        return SmsListViewViewHolder(
            smsListItemBinding
        )
    }

    override fun onBindViewHolder(
        smsListViewViewHolder: SmsListViewViewHolder,
        i: Int
    ) {
        val currentSms: SmsMessage = sms_list_view_list[i]
        val currentUser: User = sms_list_view_list[i].user

        smsListViewViewHolder.smsListItemBinding?.sms = currentSms
        smsListViewViewHolder.smsListItemBinding?.user = currentUser
        smsListViewViewHolder.smsListItemBinding?.util = util
    }

    override fun getItemCount(): Int {
        return sms_list_view_list.size
    }

    fun setSmsListViewList(app_user: AppUser, sms_list_view_list: MutableList<SmsMessage>) {
        this.app_user = app_user
        this.sms_list_view_list = sms_list_view_list
        notifyDataSetChanged()
    }

    inner class SmsListViewViewHolder :
        RecyclerView.ViewHolder{
        var smsListItemBinding: SmsListItemBinding? = null
        var listSubHeaderBinding: ListSubHeaderBinding? = null

        constructor(binding: SmsListItemBinding):super(binding.root){
            smsListItemBinding = binding
        }

        constructor(binding: ListSubHeaderBinding):super(binding.root){
            listSubHeaderBinding = binding
        }

    }


    inner class SmsItemListener(_sms: SmsMessage) : View.OnClickListener {
        var sms = _sms

        override fun onClick(v: View?) {
            //TODO - consider passing parameter
            var direction = SmsListViewFragmentDirections.moveToNavGraphSmsView()
            navController.navigate(direction)
        }

    }
}

