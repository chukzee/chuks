package com.beepmemobile.www.ui.binding

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.User
import com.beepmemobile.www.databinding.ListSubHeaderBinding
import com.beepmemobile.www.databinding.SearchUserLargeCardBinding
import com.beepmemobile.www.util.Util

class SearchUserLargeCardListAdapter(title: String) :
    RecyclerView.Adapter<SearchUserLargeCardListAdapter.SearchUserCardListViewHolder>() {
    private var user_list = listOf<User> ()
    private var app_user: AppUser = AppUser();
    private val util = Util()
    private val subtitle = title
    private val extra_items_count  get() = if (subtitle.isNotEmpty()) 1 else 0

    override fun onCreateViewHolder(
        viewGroup: ViewGroup,
        i: Int
    ): SearchUserCardListViewHolder {

        if(i == 0 && extra_items_count == 1){
            val listSubHeaderBinding = ListSubHeaderBinding.inflate(
                LayoutInflater.from(viewGroup.context),
                viewGroup,
                false)

            return SearchUserCardListViewHolder(
                listSubHeaderBinding
            )
        }else{

            val searchUserCardBinding = SearchUserLargeCardBinding.inflate(
                LayoutInflater.from(viewGroup.context),
                viewGroup,
                false)

            return SearchUserCardListViewHolder(
                searchUserCardBinding
            )
        }
    }

    override fun onBindViewHolder(
        callListViewListViewHolder: SearchUserCardListViewHolder,
        i: Int
    ) {
        if(i == 0 && extra_items_count == 1){
            callListViewListViewHolder.listSubHeaderBinding?.listSubheaderTitle?.text = subtitle
        }else {
            val currentUser: User = user_list[i]

            callListViewListViewHolder.searchUserLargeCardBinding?.user = currentUser
            callListViewListViewHolder.searchUserLargeCardBinding?.appUser = this.app_user
            callListViewListViewHolder.searchUserLargeCardBinding?.util = this.util
        }
    }

    override fun getItemCount(): Int {
        return user_list.size + this.extra_items_count
    }

    fun setSearchUserCardList(app_user: AppUser, user_list: MutableList<User>) {
        this.app_user = app_user
        this.user_list = user_list
        notifyDataSetChanged()
    }

    inner class SearchUserCardListViewHolder :
        RecyclerView.ViewHolder {
        var searchUserLargeCardBinding: SearchUserLargeCardBinding? = null
        var listSubHeaderBinding : ListSubHeaderBinding? = null
        constructor(binding: SearchUserLargeCardBinding):super(binding.root){
            searchUserLargeCardBinding = binding
        }

        constructor(binding: ListSubHeaderBinding):super(binding.root){
            listSubHeaderBinding = binding
        }

    }

}