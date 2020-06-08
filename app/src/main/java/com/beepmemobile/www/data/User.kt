package com.beepmemobile.www.data

import java.util.*

open class User {


    var user_id = "" // which the verified phone number during registraion
    var first_name: String = ""
    var last_name: String = ""
    var photo_url: String = ""
    val display_name get()= (first_name + " " + last_name).trim()
    val full_name get()= display_name
    var home_address: String = ""
    var office_address: String = ""
    var location: String = "" // using google location finder
    var last_seen_time: Date = Date();
    val mobile_phone_no get() = user_id // which the verified phone number during registraion
    var work_phone_no = ""
    var personal_email = ""
    var work_email = ""
    var status_message = ""
    var chat_activity = ""//whether online, typing e.t.c

}