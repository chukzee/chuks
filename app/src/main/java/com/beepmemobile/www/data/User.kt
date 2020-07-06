package com.beepmemobile.www.data

import com.beepmemobile.www.util.Constants
import java.util.*

/*
    This is the user model - its fields must match the users table in the remote end
 */
open class User() {

    var user_type = Constants.FREE_USERS
    var phone_number_verified_at = Date()
    var password = ""//for now we dont use password but we will reserve it here for future consideration e.g we user connect from web site
    var api_token = ""
    var user_id = "" // which the verified phone number during registration
    var country_code = ""//two letters country code of the user verified phone number - e.g  Nigeria = NG, United States = US e.t.c
    var dialling_code = 0
    var country = ""
    var is_contact = false
    var joined_date: Date? = null
    val is_registered get() = joined_date != null
    var photo_url: String = ""
    var first_name = ""
    var display_name = ""
    var last_name = ""
    var home_address: String = Constants.STR_NA
    var office_address: String = Constants.STR_NA
    var location_address: String = Constants.STR_NA// using google location finder
    var latitude : Double? = null;
    var longitude : Double? = null;
    var contacts = ""
    var dob:  Date? = null
    var last_seen:  Date? = null
    var mobile_phone_no  = Constants.STR_NA // which the verified phone number during registration
    var work_phone_no = Constants.STR_NA
    var personal_email = Constants.STR_NA
    var work_email = Constants.STR_NA
    var website = Constants.STR_NA
    var status_message = ""
    var chat_activity = ""//whether online, typing e.t.c

}