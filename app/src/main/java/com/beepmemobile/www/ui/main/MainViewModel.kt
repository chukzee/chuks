package com.beepmemobile.www.ui.main

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.beepmemobile.www.data.*;
import com.beepmemobile.www.dummy.Dummy
import kotlinx.coroutines.launch

class MainViewModel : ViewModel() {
    val auth: MutableLiveData<AppUser> by lazy {
        MutableLiveData(AppUser()).also { checkAuth(it) }
    }

    val app_user get() = auth.value

    /*
        Asynchronously check authentication of user
        Read the user auth saved to the system
     */
    private fun checkAuth(it: MutableLiveData<AppUser>) {

        this.viewModelScope.launch {
            it.value = readUseInfoFromDisk()
        }

    }

    fun singupStage(data: String, stage: AuthState){

        this.viewModelScope.launch{

            when (stage) {
                AuthState.AUTH_STAGE_BEGIN -> {
                    //update the LiveData
                    auth.value = auth.value?.setAuth(AuthState.AUTH_STAGE_USERNAME)
                }
                AuthState.AUTH_STAGE_USERNAME -> {
                    val res = sendAuth(data, "username")
                    if(res.success) {
                        //update the LiveData
                        auth.value = res.auth_user.setAuth(AuthState.AUTH_STAGE_PASSWORD)
                    }
                }
                AuthState.AUTH_STAGE_PASSWORD -> {
                    val res = sendAuth(data, "password")
                    if(res.success) {
                        //update the LiveData
                        auth.value = res.auth_user.setAuth(AuthState.AUTH_STAGE_FULL_NANE)
                    }
                }
                AuthState.AUTH_STAGE_FULL_NANE -> {
                    val res = sendAuth(data, "full_name")
                    if(res.success) {
                        //update the LiveData
                        auth.value = res.auth_user.setAuth(AuthState.AUTH_STAGE_PROFILE_PHOTO)
                    }
                }
                AuthState.AUTH_STAGE_PROFILE_PHOTO -> {
                    val res = sendAuth(data, "profile_photo")
                    if(res.success) {
                        //update the LiveData
                        auth.value = res.auth_user.setAuth(AuthState.AUTH_STAGE_PHONE_NUMBER_VERIFY)
                    }
                }
                AuthState.AUTH_STAGE_PHONE_NUMBER_VERIFY -> {
                    val res = sendAuth(data, "phone_no_verify")
                    if(res.success) {
                        //update the LiveData
                        auth.value = res.auth_user.setAuth(AuthState.AUTH_STAGE_CONFIRM_VERIFICATION_CODE)
                    }
                }
                AuthState.AUTH_STAGE_CONFIRM_VERIFICATION_CODE -> {
                    val res = sendAuth(data, "confirm_verification_code")
                    if(res.success && saveUserInfoToDisk(res.auth_user)) {
                        //update the LiveData
                        auth.value = res.auth_user.setAuth(AuthState.AUTH_STAGE_SUCCESS)
                    }
                }
            }
        }

    }

    fun sendAuth(data: String, query_param: String): Result{
        //TODO Send the data to the server


        var result = Result()//populate with server response

        result = Dummy().signUp()

        return result;
    }

    fun readUseInfoFromDisk() : AppUser{
        //TODO Read user info saved to the system

        var dummy_user = AppUser()//TODO - To be replace by real code - data read from the system

        return dummy_user
    }

    fun saveUserInfoToDisk(app_user: AppUser): Boolean{
        var success = true//TODO - set to false in actual implementation
        //TODO - save user info to disk

        return success
    }

     class Result{
        var success =false;
        var responseStr = ""
        var auth_user  = AppUser()
    }
}
