package com.beepmemobile.www.ui.contacts

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.beepmemobile.www.ui.AbstractListViewModel
import com.beepmemobile.www.data.*;
import com.beepmemobile.www.data.msg.Contact
import com.beepmemobile.www.dummy.Dummy

class ContactsListViewModel : AbstractListViewModel<Contact>() {
    private val contact_list: MutableLiveData<MutableList<Contact>> by lazy {
        MutableLiveData<MutableList<Contact>>().also {
            load(it)
        }
    }
    override fun getList(): MutableLiveData<MutableList<Contact>> {
        return this.contact_list
    }


    fun load(it: MutableLiveData<MutableList<Contact>>) {
        // Do an asynchronous operation to fetch users.

        //TODO - REPLACE DUMMY TEST WITH REAL DATA

        it.value = Dummy().getTestContactList(50)
    }
}
