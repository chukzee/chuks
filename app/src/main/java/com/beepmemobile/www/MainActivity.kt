package com.beepmemobile.www

import android.content.res.Configuration
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.drawerlayout.widget.DrawerLayout
import androidx.navigation.findNavController
import androidx.navigation.ui.*
import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.google.android.material.navigation.NavigationView
import com.google.android.material.snackbar.Snackbar

class MainActivity : AppCompatActivity() {

    private lateinit var appBarConfiguration: AppBarConfiguration
    var navView: NavigationView? = null
    var drawerLayout: DrawerLayout? = null
    var toolbar: Toolbar? = null;
    var currentDestinationID: Int = 0


     override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main_activity)

            val navController = findNavController(R.id.nav_host_fragment)
            navController.addOnDestinationChangedListener{ controller, destination, arguments  ->
                currentDestinationID = destination.id
                when(destination.id) {
                    R.id.HomeFragment -> {
                        drawerLayout?.setDrawerLockMode(DrawerLayout.LOCK_MODE_UNLOCKED)
                    }
                    else -> {
                        drawerLayout?.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED)
                    }

                }



                //whether to hide or show action bar
                determineWhetherToShowActionBar()

            }

            toolbar = findViewById(R.id.main_app_bar_toolbar)
            setSupportActionBar(toolbar)

             drawerLayout = findViewById(R.id.home_drawer_layout)
             navView = findViewById(R.id.home_nav_view)

            // Passing each menu ID as a set of Ids because each
            // menu should be considered as top level destinations.
            appBarConfiguration = AppBarConfiguration(setOf(R.id.HomeFragment), drawerLayout)
            setupActionBarWithNavController(navController, appBarConfiguration)
            navView?.setupWithNavController(navController)
    }

    fun determineWhetherToShowActionBar(){

        when(currentDestinationID){
            R.id.signUpConfirmVerificationCodeFragment,
            R.id.signUpFullNameFragment,
            R.id.signUpPasswordFragment,
            R.id.signUpPhoneNumberVerificationFragment,
            R.id.signUpProfilePhotoFragment,
            R.id.signUpUsernameFragment,
            R.id.signUpWelcomeFragment,
            R.id.PersonalProfileFragment,
            R.id.EditProfileFragment->{
                toolbar?.visibility =  View.GONE
            }
            else ->{
                toolbar?.visibility =  View.VISIBLE
            }
        }
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)

        //whether to hide or show action bar
        determineWhetherToShowActionBar()
    }

    override fun onResume() {
        super.onResume()
        determineWhetherToShowActionBar()
    }

    override fun onRestart() {
        super.onRestart()
        determineWhetherToShowActionBar()
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.home_app_bar, menu)
        return true
    }

    override fun onSupportNavigateUp(): Boolean {
        val navController = findNavController(R.id.nav_host_fragment)
        return navController.navigateUp(appBarConfiguration) || super.onSupportNavigateUp()
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        val navController = findNavController(R.id.nav_host_fragment)
        return item.onNavDestinationSelected(navController) || super.onOptionsItemSelected(item)
    }
}
