package com.beepmemobile.www.ui.call

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.beepmemobile.www.data.*;
import com.beepmemobile.www.dummy.Dummy
import com.beepmemobile.www.ui.AbstractListViewModel

class CallListViewModel : AbstractListViewModel<Call>() {
    private val call_list: MutableLiveData<MutableList<Call>> by lazy {
        MutableLiveData<MutableList<Call>>().also {
            load(it)
        }
    }


    override fun getList(): MutableLiveData<MutableList<Call>> {
        return call_list
    }

    fun load(it: MutableLiveData<MutableList<Call>>) {
        // Do an asynchronous operation to fetch users.

        //TODO - REPLACE DUMMY TEST WITH REAL DATA

        it.value = Dummy().getTestCallInfoList(100)
    }
}
