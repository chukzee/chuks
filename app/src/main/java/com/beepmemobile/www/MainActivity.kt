package com.beepmemobile.www

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.ui.main.MainFragment
import com.beepmemobile.www.ui.main.MainViewModel

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main_activity)

        Toast.makeText(this, "after setContentView ", Toast.LENGTH_LONG).show()

        /*
		if (savedInstanceState == null) {
			Toast.makeText(this, "REMIND: REMOVE THIS IF BLOCK OF  if (savedInstanceState == null)", Toast.LENGTH_LONG).show()			
            Toast.makeText(this, "inside if savedInstanceState == null", Toast.LENGTH_LONG).show()

            supportFragmentManager.beginTransaction()
                    .replace(R.id.container, MainFragment.newInstance())
                    .commitNow()
        }
		*/
    }
}
