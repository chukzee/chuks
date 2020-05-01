package com.beepmemobile.www.data

open class User {


    var user_id = ""
    var first_name: String = ""
    var last_name: String = ""
    var photo_url: String = ""
    val display_name get()= (first_name + " " + last_name).trim()
    val full_name get()= display_name
    var address: String = ""
    var phone_no = ""
    var email = ""

}