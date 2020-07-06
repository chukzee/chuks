package com.beepmemobile.www.remote

import com.beepmemobile.www.data.User


object Model {
     open class Result{//must match the result class in the server
          var success = false
          var msg = ""
          var errMsg = ""
          var debugMsg = ""
          var stackTraceMsg = ""
     }

    class ResultAuth: Result(){//must match the result class in the server
        var data = ""
    }

    class ResultUser: Result(){//must match the result class in the server
        var data: User = User() // This is the user model - its fields must match the users table in the remote end
    }

    class ResultFeedback: Result() {
        var data = ""
    }

    class ResultContactList: Result() {
        var data = mutableListOf<Contact>()

         inner class Contact{
             var name= ""
             var phone_no = ""
         }
    }

    class ResultUserList: Result() {
        var data = mutableListOf<User>()
    }


}