package com.beepmemobile.www.ui.binding

import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.Space
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.R
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.msg.Contact
import com.beepmemobile.www.databinding.ContactListItemBinding
import com.beepmemobile.www.databinding.ListSubHeaderBinding
import com.beepmemobile.www.util.Util

class ContactListAdapter :
    RecyclerView.Adapter<ContactListAdapter.ContactListViewHolder>() {
    private var contact_map = mutableMapOf<Any, Any> ()
    private  var keys = contact_map.keys.toList()
    private var app_user: AppUser = AppUser();
    private val util = Util()

    private val FOOTER = "FOOTER"

    private val FOOTER_TYPE = 1
    private val ITEM_TYPE = 2


    private fun isFooter(i:Int): Boolean{
        return keys[i] is String &&  keys[i] == FOOTER
    }

    private fun isContactObject(i:Int): Boolean{
        return keys[i] is Int && contact_map[keys[i]] is Contact
    }

    override fun onCreateViewHolder(
        viewGroup: ViewGroup,
        i: Int
    ): ContactListViewHolder {

        if(i == FOOTER_TYPE){
            var space = Space(viewGroup.context)
            space.layoutParams = LinearLayout.LayoutParams(
                //width
                LinearLayout.LayoutParams.MATCH_PARENT,
                //height
                viewGroup.context.resources.getDimensionPixelOffset(R.dimen.list_item_large_height)
            )

            return ContactListViewHolder(space)

        }else {
            val contactListItemBinding = ContactListItemBinding.inflate(
                LayoutInflater.from(viewGroup.context),
                viewGroup,
                false
            )

            return ContactListViewHolder(
                contactListItemBinding
            )
        }
    }

    override fun onBindViewHolder(
        contactListViewListViewHolder: ContactListViewHolder,
        i: Int
    ) {
        if(isFooter(i)){
            //TODO - may added click event to footer
        }else {
            val currentContact: Contact = contact_map[i] as Contact
            contactListViewListViewHolder.contactListItemBinding?.contact = currentContact
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
        return contact_map.size
    }

    fun setContactList(app_user: AppUser, contact_list: MutableList<Contact>) {
        this.app_user = app_user

        var index = 0
        contact_list.forEach{
            contact_map[index]=it
            index++
        }

        contact_map[FOOTER] = ""
        keys = contact_map.keys.toList()

        notifyDataSetChanged()
    }

    inner class ContactListViewHolder :
        RecyclerView.ViewHolder {
        var contactListItemBinding: ContactListItemBinding? = null
        var listSubHeaderBinding: ListSubHeaderBinding? = null

        constructor(binding: ContactListItemBinding):super(binding.root){
            contactListItemBinding = binding
        }

        constructor(binding: ListSubHeaderBinding):super(binding.root){
            listSubHeaderBinding = binding
        }
        constructor(space: Space):super(space)
    }
}