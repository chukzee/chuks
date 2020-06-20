package com.beepmemobile.www.data.msg

import com.beepmemobile.www.data.*;

class SmsMessage: Message() {

    var subject = ""
    var sms_phone_no ="";

    /*
        NOTE: To avoid binding error make sure the binding methods are defined in the
          binding class and not in the super class. If the method in not define in the
          class it will cause frustration binding error even if the method is in the
          super class. So please note this common mistake. Data Binding library is too strict and
          easily cause issues if things are not done strictly
     */
    override fun send(text: String){

    }
}