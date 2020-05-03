package com.beepmemobile.www

import androidx.lifecycle.MutableLiveData
import com.beepmemobile.www.data.User

class Auth : MutableLiveData<User>() {

    fun checkOTP() : Boolean{
        //TODO - check system for saved One Time Password (OTP) and relevant user info
        return false;
    }
}