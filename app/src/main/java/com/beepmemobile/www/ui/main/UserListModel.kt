package com.beepmemobile.www.ui.main

import androidx.lifecycle.MutableLiveData
import com.beepmemobile.www.data.*;
import com.beepmemobile.www.dummy.Dummy
import com.beepmemobile.www.ui.AbstractListViewModel
import me.everything.providers.android.contacts.Contact

class UserListModel : AbstractListViewModel<User>() {

    var phoneContacts: MutableList<Contact>? = mutableListOf<Contact>()

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

        if(phoneContacts == null || phoneContacts?.size == 0) {//TODO -  TO BE REMOVED AFTER TESTING
             result = Dummy().getTestUserList(50)//TODO -  TO BE REMOVED AFTER TESTING
        }


        var remote_users = remoteLoad()
        if(remote_users.size > 0){
            result = remote_users
        }


        //merge phone contacts to users loaded

        if(phoneContacts != null) {
            for (contact in phoneContacts!!) {
                var foundUser: User? = null

                for (user in result) {
                    if (user.user_id ==  contact.phone) {
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
                    user.user_id =  contact.phone // phone no.
                    user.personal_email = contact.email
                    user.display_name = contact.displayName
                    user.is_contact = true
                    result.add(user) // add the unregistered contact user
                }
            }
        }

        //sort in ascending order
        result.sortWith(Comparator<User> { u1, u2 ->
            var comparison = u1.display_name.compareTo(u2.display_name, true)
            when {
                comparison > 0 -> 1
                comparison == 0 -> 0
                else -> -1
            }
        })

        it.value = result

    }

    private fun remoteLoad(): MutableList<User>{
        var users = mutableListOf<User>()
        //TODO
        return users
    }
}
