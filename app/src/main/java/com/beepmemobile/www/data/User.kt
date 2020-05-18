package com.beepmemobile.www.data

import java.util.*

open class User {


    var user_id = ""
    var first_name: String = ""
    var last_name: String = ""
    var photo_url: String = ""
    val display_name get()= (first_name + " " + last_name).trim()
    val full_name get()= display_name
    var address: String = ""
    var location: String = "" // using google location finder
    var last_seen_time: Date = Date();
    var phone_no = ""
    var email = ""
    var chat_activity = ""//whether online, typing e.t.c

}