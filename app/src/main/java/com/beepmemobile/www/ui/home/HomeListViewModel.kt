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

    override fun getList(): MutableLiveData<MutableList<User>> {
        return this.user_list
    }

    fun getUser(user_id: String?): User?{
        return user_list.value?.filter { it.user_id == user_id }?.get(0)
    }

    fun load(it: MutableLiveData<MutableList<User>>) {
        // Do an asynchronous operation to fetch users.

        //TODO - REPLACE DUMMY TEST WITH REAL DATA

        it.value = Dummy().getTestUserList(50)
    }
}
