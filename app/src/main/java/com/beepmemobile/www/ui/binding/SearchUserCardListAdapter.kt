package com.beepmemobile.www.ui.binding

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.User
import com.beepmemobile.www.databinding.SearchUserCardBinding

class SearchUserCardListAdapter :
    RecyclerView.Adapter<SearchUserCardListAdapter.SearchUserCardListViewHolder>() {
    private var user_list = listOf<User> ()
    private var app_user: AppUser = AppUser();

    override fun onCreateViewHolder(
        viewGroup: ViewGroup,
        i: Int
    ): SearchUserCardListViewHolder {

        val searchUserCardBinding = SearchUserCardBinding.inflate(
            LayoutInflater.from(viewGroup.context),
            viewGroup,
            false)

        return SearchUserCardListViewHolder(
            searchUserCardBinding
        )
    }

    override fun onBindViewHolder(
        callListViewListViewHolder: SearchUserCardListViewHolder,
        i: Int
    ) {
        val currentUser: User = user_list[i]

        callListViewListViewHolder.searchUserCardBinding.user = currentUser
        callListViewListViewHolder.searchUserCardBinding.appUser = this.app_user

    }

    override fun getItemCount(): Int {
        return user_list.size
    }

    fun setSearchUserCardList(app_user: AppUser, user_list: MutableList<User>) {
        this.app_user = app_user
        this.user_list = user_list
        notifyDataSetChanged()
    }

    inner class SearchUserCardListViewHolder(binding: SearchUserCardBinding) :
        RecyclerView.ViewHolder(binding.getRoot()) {
        val searchUserCardBinding: SearchUserCardBinding = binding
    }
}