package com.beepmemobile.www.ui.chat

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.beepmemobile.www.data.User
import com.beepmemobile.www.data.msg.ChatMessage
import com.beepmemobile.www.dummy.Dummy
import com.beepmemobile.www.ui.AbstractListViewModel

class ChatMeUpViewModel : AbstractListViewModel<ChatMessage>() {
    private val chat_list: MutableLiveData<MutableList<ChatMessage>> by lazy {
        MutableLiveData<MutableList<ChatMessage>>().also {
            load(it)
        }
    }

    var app_user_chatmate: User? = null

    override fun getList(): MutableLiveData<MutableList<ChatMessage>> {
        return chat_list
    }

    fun load(it: MutableLiveData<MutableList<ChatMessage>>) {
        // Do an asynchronous operation to fetch users.

        //TODO - REPLACE DUMMY TEST WITH REAL DATA

        it.value = Dummy().getTestChatMessageList(50)
    }
}