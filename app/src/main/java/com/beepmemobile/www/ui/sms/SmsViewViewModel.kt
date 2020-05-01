package com.beepmemobile.www.ui.sms

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.beepmemobile.www.data.msg.SmsMessage
import com.beepmemobile.www.dummy.Dummy
import com.beepmemobile.www.ui.AbstractListViewModel

class SmsViewViewModel : AbstractListViewModel<SmsMessage>() {
    private val sms_list: MutableLiveData<MutableList<SmsMessage>> by lazy {
        MutableLiveData<MutableList<SmsMessage>>().also {
            load(it)
        }
    }


    override fun getList(): LiveData<MutableList<SmsMessage>> {
        return sms_list
    }

    fun load(it: MutableLiveData<MutableList<SmsMessage>>) {
        // Do an asynchronous operation to fetch users.

        //TODO - REPLACE DUMMY TEST WITH REAL DATA

        it.value = Dummy().getTestSmsMessageList(50)
    }
}
