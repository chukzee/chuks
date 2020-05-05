package com.beepmemobile.www.ui.binding

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.User
import com.beepmemobile.www.data.Call
import com.beepmemobile.www.databinding.CallListItemBinding

class CallListAdapter() :
    RecyclerView.Adapter<CallListAdapter.CallListViewHolder>() {
    private var call_list_by_type = listOf<Call> ()
    private var call_list_all = listOf<Call> ()
    private var app_user: AppUser = AppUser();
    var type =  Call.UNKNOWN

    override fun onCreateViewHolder(
        viewGroup: ViewGroup,
        i: Int
    ): CallListViewHolder {

        val callListItemBinding = CallListItemBinding.inflate(
            LayoutInflater.from(viewGroup.context),
            viewGroup,
            false)

        return CallListViewHolder(
            callListItemBinding
        )
    }

    fun initType(type: Int): CallListAdapter{
        this.type = type
        this.filterByType()
        return this
    }

    override fun onBindViewHolder(
        callListViewListViewHolder: CallListViewHolder,
        i: Int
    ) {

        val currentCall: Call = call_list_by_type[i]
        val currentUser: User = call_list_by_type[i].user

        callListViewListViewHolder.callListItemBinding.call = currentCall
        callListViewListViewHolder.callListItemBinding.user = currentUser
        callListViewListViewHolder.callListItemBinding.appUser = this.app_user

    }

    override fun getItemCount(): Int {
        return call_list_by_type.size
    }

    private fun filterByType(){
        //filter the call list based on the call type
        this.call_list_by_type = call_list_all.filter { it.call_type== type }
    }

    fun setCallList(app_user: AppUser, call_list: MutableList<Call>) {
        this.app_user = app_user

        this.call_list_all = call_list

        this.filterByType()

        notifyDataSetChanged()
    }

    inner class CallListViewHolder(binding: CallListItemBinding) :
        RecyclerView.ViewHolder(binding.root) {
        val callListItemBinding: CallListItemBinding = binding
    }
}