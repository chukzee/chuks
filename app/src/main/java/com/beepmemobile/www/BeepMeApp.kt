package com.beepmemobile.www

import android.annotation.SuppressLint
import android.app.Application
import android.widget.Toast
import androidx.multidex.MultiDexApplication

class BeepMeApp : MultiDexApplication(){

    override fun onCreate() {
            super.onCreate()
    }
}