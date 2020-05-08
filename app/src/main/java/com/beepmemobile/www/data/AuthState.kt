package com.beepmemobile.www.data

enum class AuthState {
    AUTH_STAGE_NONE,//SHOWING WELCOME PAGE AND TERMS AND CONDITION
    AUTH_STAGE_USERNAME,
    AUTH_STAGE_PASSWORD,
    AUTH_STAGE_FULL_NANE,
    AUTH_STAGE_PROFILE_PHOTO,
    AUTH_STAGE_PHONE_NUMBER_VERIFY,
    AUTH_STAGE_CONFIRM_VERIFICATION_CODE,
    AUTH_STAGE_SUCCESS
}