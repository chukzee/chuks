package com.beepmemobile.www

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        //This method sets the "main_activity_top_toolbar" toolbar as the app bar for the activity.
        setSupportActionBar(findViewById(R.id.main_activity_top_toolbar))
    }


}
