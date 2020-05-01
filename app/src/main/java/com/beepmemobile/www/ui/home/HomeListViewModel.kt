package com.beepmemobile.www.ui.home

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.beepmemobile.www.data.*;
import com.beepmemobile.www.dummy.Dummy
import com.beepmemobile.www.ui.AbstractListViewModel

class HomeListViewModel : AbstractListViewModel<User>() {
    private val user_list: MutableLiveData<MutableList<User>> by lazy {
        MutableLiveData<MutableList<User>>().also {
            load(it)
        }
    }

    override fun getList(): LiveData<MutableList<User>> {
        return this.user_list
    }

    fun load(it: MutableLiveData<MutableList<User>>) {
        // Do an asynchronous operation to fetch users.

        //TODO - REPLACE DUMMY TEST WITH REAL DATA

        it.value = Dummy().getTestUserList(50)
    }
}
