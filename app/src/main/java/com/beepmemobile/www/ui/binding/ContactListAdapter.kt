package com.beepmemobile.www.ui.binding

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.msg.Contact
import com.beepmemobile.www.databinding.ContactListItemBinding
import com.beepmemobile.www.databinding.SmsListItemBinding

class ContactListAdapter :
    RecyclerView.Adapter<ContactListAdapter.ContactListViewHolder>() {
    private var contact_list = listOf<Contact> ()
    private var app_user: AppUser = AppUser();

    override fun onCreateViewHolder(
        viewGroup: ViewGroup,
        i: Int
    ): ContactListViewHolder {

        val contactListItemBinding = ContactListItemBinding.inflate(
            LayoutInflater.from(viewGroup.context),
            viewGroup,
            false)

        return ContactListViewHolder(
            contactListItemBinding
        )
    }

    override fun onBindViewHolder(
        contactListViewListViewHolder: ContactListViewHolder,
        i: Int
    ) {
        val currentContact: Contact = contact_list[i]
        contactListViewListViewHolder.contactListItemBinding.contact = currentContact
    }

    override fun getItemCount(): Int {
        return contact_list.size
    }

    fun setContactList(app_user: AppUser, contact_list: MutableList<Contact>) {
        this.app_user = app_user
        this.contact_list = contact_list
        notifyDataSetChanged()
    }

    inner class ContactListViewHolder(binding: ContactListItemBinding) :
        RecyclerView.ViewHolder(binding.getRoot()) {
        val contactListItemBinding: ContactListItemBinding = binding
    }
}