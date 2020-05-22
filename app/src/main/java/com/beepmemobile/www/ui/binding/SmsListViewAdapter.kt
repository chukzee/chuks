package com.beepmemobile.www.ui.binding

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.Space
import androidx.navigation.NavController
import androidx.navigation.NavDirections
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.R
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.User
import com.beepmemobile.www.data.msg.SmsMessage
import com.beepmemobile.www.databinding.ListSubHeaderBinding
import com.beepmemobile.www.databinding.SmsListItemBinding
import com.beepmemobile.www.ui.sms.SmsListViewFragmentDirections
import com.beepmemobile.www.util.Util
import kotlin.math.roundToInt

class SmsListViewAdapter(navCtrlr: NavController)  :
    RecyclerView.Adapter<SmsListViewAdapter.SmsListViewViewHolder>(){
    private val navController = navCtrlr
    private var sms_map = mutableMapOf<Any, Any> ()
    private  var keys = sms_map.keys.toList()
    private var app_user: AppUser = AppUser();
    private val util = Util()

    private val HEADER = "HEADER"
    private val FOOTER = "FOOTER"

    private val FOOTER_TYPE = 1
    private val ITEM_TYPE = 2

    private fun isFooter(i:Int): Boolean{
        return keys[i] is String &&  keys[i] == FOOTER
    }

    private fun isSmsMessageObject(i:Int): Boolean{
        return keys[i] is Int && sms_map[keys[i]] is SmsMessage
    }

    override fun onCreateViewHolder(
        viewGroup: ViewGroup,
        i: Int
    ): SmsListViewViewHolder {

        if(i == FOOTER_TYPE){
            var space = Space(viewGroup.context)
            space.layoutParams = LinearLayout.LayoutParams(
                //width
                LinearLayout.LayoutParams.MATCH_PARENT,
                //height
                viewGroup.context.resources.getDimensionPixelOffset(R.dimen.list_item_medium_height)
            )

            return SmsListViewViewHolder(space)

        }else {
            val smsListItemBinding = SmsListItemBinding.inflate(
                LayoutInflater.from(viewGroup.context),
                viewGroup,
                false
            )

            var sms = sms_map[i] as SmsMessage
            smsListItemBinding.root.setOnClickListener(SmsItemListener(sms))

            return SmsListViewViewHolder(
                smsListItemBinding
            )
        }
    }

    override fun onBindViewHolder(
        smsListViewViewHolder: SmsListViewViewHolder,
        i: Int
    ) {
        if(isFooter(i)){
            //TODO - may added click event to footer
        }else {
            val currentSms: SmsMessage = sms_map[i] as SmsMessage
            val currentUser: User = currentSms.user

            smsListViewViewHolder.smsListItemBinding?.sms = currentSms
            smsListViewViewHolder.smsListItemBinding?.user = currentUser
            smsListViewViewHolder.smsListItemBinding?.util = util
        }
    }

    override fun getItemViewType(position: Int): Int {
        if(isFooter(position)){
            return FOOTER_TYPE
        }else{
            return ITEM_TYPE
        }
    }

    override fun getItemCount(): Int {
        return sms_map.size
    }

    fun setSmsListViewList(app_user: AppUser, sms_list_view_list: MutableList<SmsMessage>) {
        this.app_user = app_user

        var index = 0
        sms_list_view_list.forEach{
            sms_map[index]=it
            index++
        }

        sms_map[FOOTER] = ""
        keys = sms_map.keys.toList()

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

        constructor(space: Space):super(space)
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

