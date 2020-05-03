package com.beepmemobile.www.ui.profile

import androidx.lifecycle.LiveData
import com.beepmemobile.www.data.*;
import com.beepmemobile.www.ui.AbstractListViewModel

class PersonalProfileListViewModel : AbstractListViewModel<User>() {

    override fun getList(): LiveData<MutableList<User>> {
        //TODO
        return null!!
    }
}
