package com.beepmemobile.www.ui.binding

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.User
import com.beepmemobile.www.data.Call
import com.beepmemobile.www.databinding.CallListItemBinding

class CallListAdapter :
    RecyclerView.Adapter<CallListAdapter.CallListViewHolder>() {
    private var call_list = mutableListOf<Call> ()
    private var app_user: AppUser = AppUser();

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

    override fun onBindViewHolder(
        callListViewListViewHolder: CallListViewHolder,
        i: Int
    ) {
        val currentCall: Call = call_list[i]
        val currentUser: User = call_list[i].user

        callListViewListViewHolder.callListItemBinding.call = currentCall
        callListViewListViewHolder.callListItemBinding.user = currentUser
        callListViewListViewHolder.callListItemBinding.appUser = this.app_user

    }

    override fun getItemCount(): Int {
        return call_list.size
    }

    fun setCallList(app_user: AppUser, call_list: MutableList<Call>) {
        this.app_user = app_user
        this.call_list = call_list
        notifyDataSetChanged()
    }

    inner class CallListViewHolder(binding: CallListItemBinding) :
        RecyclerView.ViewHolder(binding.getRoot()) {
        val callListItemBinding: CallListItemBinding = binding

    }
}