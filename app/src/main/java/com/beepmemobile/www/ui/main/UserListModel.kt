package com.beepmemobile.www.ui.main

import android.app.AlertDialog
import android.content.Context
import androidx.lifecycle.MutableLiveData
import com.beepmemobile.www.data.User
import com.beepmemobile.www.remote.Model
import com.beepmemobile.www.remote.RemoteApiService
import com.beepmemobile.www.ui.AbstractListViewModel
import com.beepmemobile.www.util.Constants
import com.beepmemobile.www.util.Util
import com.google.gson.Gson
import io.reactivex.Observable
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.Disposable
import io.reactivex.schedulers.Schedulers
import me.everything.providers.android.contacts.Contact


class UserListModel : AbstractListViewModel<User>() {

    val gson = Gson()
    var phoneContacts: MutableList<Contact>? = mutableListOf<Contact>()
    var context: Context? = null

    var remoteApiService: RemoteApiService? = null
    var disposable: Disposable? = null

    private val user_list: MutableLiveData<MutableList<User>> by lazy {
        MutableLiveData<MutableList<User>>().also {
            load(it)
        }
    }

    override fun getList(): MutableLiveData<MutableList<User>> {
        return this.user_list
    }

    fun getUser(user_id: String?): User?{
        var fl = user_list.value?.filter { it.user_id == user_id }
        return if (fl!=null && fl.size > 0) fl.get(0) else null
    }

    fun load(it: MutableLiveData<MutableList<User>>) {
        // Do an asynchronous operation to fetch users from the server.

        var result = mutableListOf<User>()

        /*(if(phoneContacts == null || phoneContacts?.size == 0) {//TODO -  TO BE REMOVED AFTER TESTING
             result =
                 context?.let { it1 -> Dummy(it1).getTestUserList(50) }?: result//TODO -  TO BE REMOVED AFTER TESTING
        }*/


        //load users remotely

        var contacts_1E64_phones = mutableListOf<String>()

        if(phoneContacts != null && context != null) {
            for (contact in phoneContacts!!) {
                val phoneNo = Util.reformPhoneNumber(context!!, contact.phone)
                contacts_1E64_phones.add(phoneNo.numberE164)

            }
        }

        var json = gson.toJson(contacts_1E64_phones)
        var observable = remoteApiService?.getContactUsers(json, Constants.DEFAULT_SEARCH_LIMIT)
        handleObservable(observable, it)
    }

    private fun onLoadUsers(res: Model.ResultUserList, it: MutableLiveData<MutableList<User>>){

        //merge phone contacts to users loaded

        val users = res.data

        if(phoneContacts != null && context != null) {
            for (contact in phoneContacts!!) {
                var foundUser: User? = null
                val phoneNo = Util.reformPhoneNumber(context!!, contact.phone)
                var numberE164 = phoneNo.numberE164
                for (user in users) {
                    if (user.user_id ==  numberE164) {
                        foundUser = user
                        break;
                    }
                }

                if (foundUser != null) {//user is registered
                    // use the contact displayName like in other app e.g WhatsApp
                    foundUser.display_name = contact.displayName
                    foundUser.is_contact = true
                } else {//the contact is unregistered with us
                    //create unregistered user from contact

                    var user = User()//by default the user is unregistered
                    user.user_id =  numberE164 // phone no.
                    user.mobile_phone_no = contact.phone
                    user.personal_email = if( Util.isValidEmail(contact.email) ) contact.email else user.personal_email
                    user.display_name = contact.displayName
                    user.is_contact = true
                    users.add(user) // add the unregistered contact user
                }
            }
        }



        //sort in ascending order
        users.sortWith(Comparator<User> { u1, u2 ->
            var comparison = u1.display_name.compareTo(u2.display_name, true)
            when {
                comparison > 0 -> 1
                comparison == 0 -> 0
                else -> -1
            }
        })

        it.value = users

    }

    fun onError(ex: Throwable){

        AlertDialog.Builder(context)
            .setMessage(ex.message)
            .create()
            .show()

        Util.logExternal(context, ex)//TODO - IN PRODUCTION USE ACCRA TO SEND THE ERROR REPORT
    }

    fun handleObservable(observable: Observable<Model.ResultUserList>?, it: MutableLiveData<MutableList<User>>){
        disposable = observable?.subscribeOn(Schedulers.io())
            ?.observeOn(AndroidSchedulers.mainThread())
            ?.subscribe(
                { result -> onLoadUsers(result, it)},
                { error ->  onError(error)}
            )
    }

}
