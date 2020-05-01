package com.beepmemobile.www.ui.call

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.beepmemobile.www.data.*;
import com.beepmemobile.www.data.msg.Contact
import com.beepmemobile.www.ui.AbstractListViewModel

class CallListViewModel : AbstractListViewModel<Call>() {
    private val call__list: MutableLiveData<List<Call>> by lazy {
        MutableLiveData<List<Call>>().also {
            load()
        }
    }

    var currentCall : Call = Call();

    fun getCurrentCotact() : Contact{
        //TODO - Get the contact object through the Map using currentCallInfo phone number or user_id as the case may be
        return Contact();
    }
    override fun getList(): LiveData<List<Call>> {
        return call__list
    }

    override fun load() {
        // Do an asynchronous operation to fetch users.
    }
}
