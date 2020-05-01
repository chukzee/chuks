package com.beepmemobile.www.ui

import androidx.databinding.ViewDataBinding
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.beepmemobile.www.data.*;

abstract class AbstractListViewModel <T>:ViewModel() {

    open fun getList(): LiveData<List<T>> {return MutableLiveData()}

    open  fun load() {

        // Do an asynchronous operation to fetch users.
    }
}