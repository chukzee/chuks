package com.beepmemobile.www.ui.support

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.beepmemobile.www.data.msg.ChatMessage
import com.beepmemobile.www.dummy.Dummy
import com.beepmemobile.www.ui.AbstractListViewModel

class SupportChatListViewModel : AbstractListViewModel<ChatMessage>() {
    private val sms_list: MutableLiveData<MutableList<ChatMessage>> by lazy {
        MutableLiveData<MutableList<ChatMessage>>().also {
            load(it)
        }
    }


    override fun getList(): LiveData<MutableList<ChatMessage>> {
        return sms_list
    }

    fun load(it: MutableLiveData<MutableList<ChatMessage>>) {
        // Do an asynchronous operation to fetch users.

        //TODO - REPLACE DUMMY TEST WITH REAL DATA

        it.value = Dummy().getTestChatMessageList(50)
    }
}
