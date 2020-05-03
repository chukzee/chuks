package com.beepmemobile.www.ui.contacts

import androidx.lifecycle.LiveData
import com.beepmemobile.www.ui.AbstractListViewModel
import com.beepmemobile.www.data.*;
import com.beepmemobile.www.data.msg.Contact

class ContactsListViewModel : AbstractListViewModel<Contact>() {

    override fun getList(): LiveData<MutableList<Contact>> {
        //TODO
        return null!!
    }
}
