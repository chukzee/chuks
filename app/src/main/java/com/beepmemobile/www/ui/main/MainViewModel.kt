package com.beepmemobile.www.ui.main

import android.app.AlertDialog
import android.content.Context
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.beepmemobile.www.data.*;
import com.beepmemobile.www.dummy.Dummy
import com.beepmemobile.www.remote.Model
import com.beepmemobile.www.remote.RemoteApiService
import com.beepmemobile.www.util.Util
import io.reactivex.Observable
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.Disposable
import io.reactivex.schedulers.Schedulers
import kotlinx.coroutines.launch

class MainViewModel : ViewModel() {

    val auth: MutableLiveData<AppUser> by lazy {
        MutableLiveData(AppUser()).also { checkAuth(it) }
    }

    val app_user get() = auth.value
    var context: Context? = null

    var remoteApiService: RemoteApiService? = null
    var disposable: Disposable? = null

    /*
        Asynchronously check authentication of user
        Read the user auth saved to the system
     */
    private fun checkAuth(it: MutableLiveData<AppUser>) {

        this.viewModelScope.launch {
            it.postValue(readUserInfoFromDisk())
        }

    }

    fun singupStage(data: Map<String, String>, stage: AuthState){

        this.viewModelScope.launch{

            when (stage) {
                AuthState.AUTH_STAGE_NONE -> {
                    //update the LiveData
                    auth.postValue(auth.value?.modifyAuth(AuthState.AUTH_STAGE_PHONE_NUMBER_VERIFY))
                }                
                AuthState.AUTH_STAGE_PHONE_NUMBER_VERIFY -> {
                    val observable  = remoteApiService?.signUpVerifyPhoneNumber(
                        data["user_id"],
                        data["mobile_phone_no"],
                        data["dialling_code"],
                        data["country_code"],
                        data["country"])

                    handleObservable(observable);
                }
                AuthState.AUTH_STAGE_CONFIRM_VERIFICATION_CODE -> {
                    val observable  = remoteApiService?.signUpComfirmPhoneNumber(data["user_id"], data["confirm_verification_code"])
                    handleObservable(observable);
                }
                AuthState.AUTH_STAGE_FULL_NANE -> {
                    val observable  = remoteApiService?.signUpName(data["user_id"],data["first_name"],data["last_name"])
                    handleObservable(observable);
                }
                AuthState.AUTH_STAGE_PROFILE_PHOTO -> {
                    val observable = remoteApiService?.signUpProfilePhoto(data["user_id"],data["profile_photo_base64"],data[""])
                    handleObservable(observable);
                }
            }
        }

    }

    fun handleObservable(observable: Observable<Model.ResultAuth>?){
        disposable = observable?.subscribeOn(Schedulers.io())
            ?.observeOn(AndroidSchedulers.mainThread())
            ?.subscribe(
                { result -> onAuthStageSuccess(result)},
                { error ->  onAuthStageError(error)}
            )
    }

    fun onAuthStageSuccess(res: Model.ResultAuth){
        if(res.success) {
            //update the LiveData
            auth.postValue(app_user?.modifyAuth(AuthState.AUTH_STAGE_CONFIRM_VERIFICATION_CODE))
        }else{

            if(res.errMsg.isNotEmpty()) {
                AlertDialog.Builder(context)
                    .setMessage(res.errMsg)
                    .create()
                    .show()
            }

            if(res.debugMsg.isNotEmpty()){
                Util.logExternal(context, res.debugMsg)//TODO - IN PRODUCTION USE ACCRA TO SEND THE ERROR REPORT
            }
            if(res.stackTraceMsg.isNotEmpty()){
                Util.logExternal(context, res.stackTraceMsg)//TODO - IN PRODUCTION USE ACCRA TO SEND THE ERROR REPORT
            }

        }

        if(res.success && saveUserInfoToDisk(app_user)) {
            //update the LiveData
            auth.postValue(app_user?.modifyAuth(AuthState.AUTH_STAGE_FULL_NANE))
        }
        if(res.success) {
            //update the LiveData
            auth.postValue(app_user?.modifyAuth(AuthState.AUTH_STAGE_PROFILE_PHOTO))
        }
        if(res.success) {
            //update the LiveData
            auth.postValue(app_user?.modifyAuth(AuthState.AUTH_STAGE_SUCCESS))
        }
    }

    fun onAuthStageError(ex: Throwable){

        AlertDialog.Builder(context)
            .setMessage(ex.message)
            .create()
            .show()

        Util.logExternal(context, ex)//TODO - IN PRODUCTION USE ACCRA TO SEND THE ERROR REPORT
    }

    fun readUserInfoFromDisk() : AppUser{
        //TODO Read user info saved to the system

        var user = AppUser()

        return user
    }

    fun saveUserInfoToDisk(app_user: AppUser?): Boolean{
        var success = true//TODO - set to false in actual implementation
        //TODO - save user info to disk

        return success
    }

}
