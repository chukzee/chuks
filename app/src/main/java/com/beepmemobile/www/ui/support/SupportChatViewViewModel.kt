package com.beepmemobile.www.ui.support

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.beepmemobile.www.data.User
import com.beepmemobile.www.data.msg.ChatMessage
import com.beepmemobile.www.databinding.SupportChatViewFragmentBinding
import com.beepmemobile.www.dummy.Dummy
import com.beepmemobile.www.ui.AbstractListViewModel

class SupportChatViewViewModel : AbstractListViewModel<ChatMessage>() {
    private val support_chat_list: MutableLiveData<MutableList<ChatMessage>> by lazy {
        MutableLiveData<MutableList<ChatMessage>>().also {
            load(it)
        }
    }

    var app_user_chatmate: User? = null

    override fun getList(): LiveData<MutableList<ChatMessage>> {
        return support_chat_list
    }

    fun load(it: MutableLiveData<MutableList<ChatMessage>>) {
        // Do an asynchronous operation to fetch users.

        //TODO - REPLACE DUMMY TEST WITH REAL DATA

        it.value = Dummy().getTestChatMessageList(50)
    }
}
