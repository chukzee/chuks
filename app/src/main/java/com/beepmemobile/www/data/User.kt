package com.beepmemobile.www.data

import com.beepmemobile.www.util.Constant
import java.util.*

open class User() {


    var user_type = Constant.FREE_USERS
    var user_id = "" // which the verified phone number during registration
    var is_contact = false
    var joined_date: Date? = null
    val is_registered get() = joined_date != null
    var photo_url: String = ""
    var display_name = ""
    var home_address: String = Constant.STR_NA
    var office_address: String = Constant.STR_NA
    var location: String = Constant.STR_NA// using google location finder
    var last_seen_time:  Date? = null
    val mobile_phone_no get() = user_id // which the verified phone number during registration
    var work_phone_no = Constant.STR_NA
    var personal_email = Constant.STR_NA
    var work_email = Constant.STR_NA
    var website = Constant.STR_NA
    var status_message = ""
    var chat_activity = ""//whether online, typing e.t.c

}