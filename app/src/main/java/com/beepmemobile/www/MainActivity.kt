package com.beepmemobile.www

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.ui.main.MainFragment

class MainActivity : AppCompatActivity() {

    var app_user : AppUser = AppUser()//come back abeg oh!!! LiveData should manage app_user object

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main_activity)
        if (savedInstanceState == null) {
            supportFragmentManager.beginTransaction()
                    .replace(R.id.container, MainFragment.newInstance())
                    .commitNow()
        }
    }
}
