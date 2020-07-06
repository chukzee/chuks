package com.beepmemobile.www

import android.Manifest
import android.app.Activity
import android.app.PendingIntent
import android.app.SearchManager
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.content.res.Configuration
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.app.ActivityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.navigation.NavController
import androidx.navigation.findNavController
import androidx.navigation.ui.*
import androidx.preference.PreferenceManager
import com.beepmemobile.www.location.LocationUpdatesBroadcastReceiver
import com.beepmemobile.www.remote.RemoteApiService
import com.beepmemobile.www.util.Utils
import com.beepmemobile.www.ui.main.MainViewModel
import com.beepmemobile.www.util.Constants
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationServices
import com.google.android.material.navigation.NavigationView
import com.google.android.material.snackbar.Snackbar
import io.reactivex.disposables.Disposable

class MainActivity : AppCompatActivity(), SharedPreferences.OnSharedPreferenceChangeListener {

    var isGPSEnable = false
    private val authModel: MainViewModel by viewModels()

    var isAppUserAuthenticated = false

    /**
     * Stores parameters for requests to the FusedLocationProviderApi.
     */
    private var mLocationRequest: LocationRequest? = null

    /**
     * Provides access to the Fused Location Provider API.
     */
    private var mFusedLocationClient: FusedLocationProviderClient? = null

    private lateinit var appBarConfiguration: AppBarConfiguration
    var navView: NavigationView? = null
    var drawerLayout: DrawerLayout? = null
    var toolbar: Toolbar? = null;
    var currentDestinationID: Int = 0

    val remoteApiServe by lazy {
        RemoteApiService.create()
    }


    var disposable: Disposable? = null

    companion object {
        private val TAG =
            MainActivity::class.java.simpleName
        private const val REQUEST_PERMISSIONS_REQUEST_CODE = 34

        /**
         * The desired interval for location updates. Inexact. Updates may be more or less frequent.
         */
        private const val UPDATE_INTERVAL: Long = 60000 // Every 60 seconds.

        /**
         * The fastest rate for active location updates. Updates will never be more frequent
         * than this value, but they may be less frequent.
         */
        private const val FASTEST_UPDATE_INTERVAL: Long = 30000 // Every 30 seconds

        /**
         * The max time before batched results are delivered by location services. Results may be
         * delivered sooner than this interval.
         */
        private const val MAX_WAIT_TIME =
            UPDATE_INTERVAL * 5 // Every 5 minutes.
    }

     override fun onCreate(savedInstanceState: Bundle?) {

         super.onCreate(savedInstanceState)

         setContentView(R.layout.main_activity)
         handleIntent(intent)

         val navController = findNavController(R.id.nav_host_fragment)

         navController.addOnDestinationChangedListener(getOnDestinationChangedListener())


         toolbar = findViewById(R.id.main_app_bar_toolbar)
         setSupportActionBar(toolbar)

         drawerLayout = findViewById(R.id.home_drawer_layout)
         navView = findViewById(R.id.home_nav_view)

         // Passing each menu ID as a set of Ids because each
         // menu should be considered as top level destinations.
         appBarConfiguration = AppBarConfiguration(setOf(R.id.HomeFragment), drawerLayout)
         setupActionBarWithNavController(navController, appBarConfiguration)
         navView?.setupWithNavController(navController)


         // Check if the user revoked runtime permissions.
         if (!checkPermissions()) {
             requestPermissions()
         }
         mFusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
         createLocationRequest()

     }



    override fun onActivityResult(
        requestCode: Int,
        resultCode: Int,
        data: Intent?
    ) {
        super.onActivityResult(requestCode, resultCode, data)
        if (resultCode == Activity.RESULT_OK) {
            if (requestCode == Constants.GPS_REQUEST) {
                isGPSEnable = true // flag maintain before get location
            }
        }
    }

    /**
     * Sets up the location request. Android has two location request settings:
     * `ACCESS_COARSE_LOCATION` and `ACCESS_FINE_LOCATION`. These settings control
     * the accuracy of the current location. This sample uses ACCESS_FINE_LOCATION, as defined in
     * the AndroidManifest.xml.
     *
     *
     * When the ACCESS_FINE_LOCATION setting is specified, combined with a fast update
     * interval (5 seconds), the Fused Location Provider API returns location updates that are
     * accurate to within a few feet.
     *
     *
     * These settings are appropriate for mapping applications that show real-time location
     * updates.
     */
    private fun createLocationRequest() {
        mLocationRequest = LocationRequest()

        // Sets the desired interval for active location updates. This interval is
        // inexact. You may not receive updates at all if no location sources are available, or
        // you may receive them slower than requested. You may also receive updates faster than
        // requested if other applications are requesting location at a faster interval.
        // Note: apps running on "O" devices (regardless of targetSdkVersion) may receive updates
        // less frequently than this interval when the app is no longer in the foreground.
        mLocationRequest?.interval = UPDATE_INTERVAL

        // Sets the fastest rate for active location updates. This interval is exact, and your
        // application will never receive updates faster than this value.
        mLocationRequest?.fastestInterval = FASTEST_UPDATE_INTERVAL
        mLocationRequest?.priority = LocationRequest.PRIORITY_HIGH_ACCURACY

        // Sets the maximum time when batched location updates are delivered. Updates may be
        // delivered sooner than this interval.
        mLocationRequest?.maxWaitTime = MAX_WAIT_TIME
    }

    // Note: for apps targeting API level 25 ("Nougat") or lower, either
    // PendingIntent.getService() or PendingIntent.getBroadcast() may be used when requesting
    // location updates. For apps targeting API level O, only
    // PendingIntent.getBroadcast() should be used. This is due to the limits placed on services
    // started in the background in "O".

    // TODO(developer): uncomment to use PendingIntent.getService().
//        Intent intent = new Intent(this, LocationUpdatesIntentService.class);
//        intent.setAction(LocationUpdatesIntentService.ACTION_PROCESS_UPDATES);
//        return PendingIntent.getService(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
    private val pendingIntent: PendingIntent
        private get() {
            // Note: for apps targeting API level 25 ("Nougat") or lower, either
            // PendingIntent.getService() or PendingIntent.getBroadcast() may be used when requesting
            // location updates. For apps targeting API level O, only
            // PendingIntent.getBroadcast() should be used. This is due to the limits placed on services
            // started in the background in "O".

            // TODO(developer): uncomment to use PendingIntent.getService().
            //        Intent intent = new Intent(this, LocationUpdatesIntentService.class);
            //        intent.setAction(LocationUpdatesIntentService.ACTION_PROCESS_UPDATES);
            //        return PendingIntent.getService(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
            val intent = Intent(this, LocationUpdatesBroadcastReceiver::class.java)
            intent.action = LocationUpdatesBroadcastReceiver.ACTION_PROCESS_UPDATES
            return PendingIntent.getBroadcast(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT)
        }

    /**
     * Return the current state of the permissions needed.
     */
    private fun checkPermissions(): Boolean {
        val permissionState = ActivityCompat.checkSelfPermission(
            this,
            Manifest.permission.ACCESS_FINE_LOCATION
        )
        return permissionState == PackageManager.PERMISSION_GRANTED
    }

    private fun requestPermissions() {
        val shouldProvideRationale =
            ActivityCompat.shouldShowRequestPermissionRationale(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            )

        // Provide an additional rationale to the user. This would happen if the user denied the
        // request previously, but didn't check the "Don't ask again" checkbox.
        if (shouldProvideRationale) {

            Snackbar.make(
                findViewById(R.id.location_activity_main),
                R.string.permission_rationale,
                Snackbar.LENGTH_INDEFINITE
            )
                .setAction(R.string.ok, View.OnClickListener { // Request permission
                    ActivityCompat.requestPermissions(
                        this@MainActivity,
                        arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
                        REQUEST_PERMISSIONS_REQUEST_CODE
                    )
                })
                .show()
        } else {

            // Request permission. It's possible this can be auto answered if device policy
            // sets the permission in a given state or the user denied the permission
            // previously and checked "Never ask again".
            ActivityCompat.requestPermissions(
                this@MainActivity,
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
                REQUEST_PERMISSIONS_REQUEST_CODE
            )
        }
    }

    /**
     * Callback received when a permissions request has been completed.
     */
    override fun onRequestPermissionsResult(
        requestCode: Int, permissions: Array<String>,
        grantResults: IntArray
    ) {
        Log.i(
            TAG,
            "onRequestPermissionResult"
        )
        if (requestCode == REQUEST_PERMISSIONS_REQUEST_CODE) {
            if (grantResults.size <= 0) {
                // If user interaction was interrupted, the permission request is cancelled and you
                // receive empty arrays.
                Log.i(
                    TAG,
                    "User interaction was cancelled."
                )
            } else if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permission was granted.
                requestLocationUpdates(null)
            } else {
                // Permission denied.

                // Notify the user via a SnackBar that they have rejected a core permission for the
                // app, which makes the Activity useless. In a real app, core permissions would
                // typically be best requested during a welcome-screen flow.

                // Additionally, it is important to remember that a permission might have been
                // rejected without asking the user for permission (device policy or "Never ask
                // again" prompts). Therefore, a user interface affordance is typically implemented
                // when permissions are denied. Otherwise, your app could appear unresponsive to
                // touches or interactions which have required permissions.
                Snackbar.make(
                    findViewById(R.id.location_activity_main),
                    R.string.permission_denied_explanation,
                    Snackbar.LENGTH_INDEFINITE
                )
                    .setAction(
                        R.string.settings,
                        View.OnClickListener { // Build intent that displays the App settings screen.
                            val intent = Intent()
                            intent.action = Settings.ACTION_APPLICATION_DETAILS_SETTINGS
                            val uri = Uri.fromParts(
                                "package",
                                BuildConfig.APPLICATION_ID, null
                            )
                            intent.data = uri
                            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                            startActivity(intent)
                        })
                    .show()
            }
        }
    }

    /**
     * Handles the Request Updates button and requests start of location updates.
     */
    fun requestLocationUpdates(view: View?) {
        try {
            Log.i(
                TAG,
                "Starting location updates"
            )
            Utils.setRequestingLocationUpdates(this, true)
            mFusedLocationClient?.requestLocationUpdates(mLocationRequest, pendingIntent)
        } catch (e: SecurityException) {
            Utils.setRequestingLocationUpdates(this, false)
            e.printStackTrace()
        }
    }

    /**
     * Handles the Remove Updates button, and requests removal of location updates.
     */
    fun removeLocationUpdates(view: View?) {
        Log.i(
            TAG,
            "Removing location updates"
        )
        Utils.setRequestingLocationUpdates(this, false)
        mFusedLocationClient?.removeLocationUpdates(pendingIntent)
    }


    private fun getOnDestinationChangedListener(): NavController.OnDestinationChangedListener {
        return NavController.OnDestinationChangedListener{ controller, destination, arguments  ->

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
    }

    fun determineWhetherToShowActionBar(){

        when(currentDestinationID){
            R.id.signUpConfirmVerificationCodeFragment,
            R.id.signUpFullNameFragment,
            R.id.signUpPhoneNumberVerificationFragment,
            R.id.signUpProfilePhotoFragment,
            R.id.signUpWelcomeFragment,
            R.id.PersonalProfileFragment,
            R.id.EditProfileFragment,
            R.id.ChatMeUpFragment->{
                toolbar?.visibility =  View.GONE
            }
            else ->{
                toolbar?.visibility =  View.VISIBLE
                setSupportActionBar(toolbar)
            }
        }
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)

        //whether to hide or show action bar
        determineWhetherToShowActionBar()
    }

    override fun onStart() {
        super.onStart()
        PreferenceManager.getDefaultSharedPreferences(this)
            .registerOnSharedPreferenceChangeListener(this)
    }

    override fun onStop() {
        PreferenceManager.getDefaultSharedPreferences(this)
            .unregisterOnSharedPreferenceChangeListener(this)
        super.onStop()
        disposable?.dispose()
    }

    override fun onPause() {
        super.onPause()
        disposable?.dispose()
    }

    override fun onResume() {
        super.onResume()
        determineWhetherToShowActionBar()
    }

    override fun onRestart() {
        super.onRestart()
        determineWhetherToShowActionBar()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleIntent(intent)


        Toast.makeText(//TODO - TO BE REMOVED
            this,
            "handleIntent(intent)",
            Toast.LENGTH_LONG
        ).show()

    }

    private fun handleIntent(intent: Intent) {

        if (Intent.ACTION_SEARCH == intent.action) {
            val query = intent.getStringExtra(SearchManager.QUERY)
            //use the query to search your data somehow
        }
    }

    override fun onSearchRequested(): Boolean {

        Toast.makeText(//TODO - TO BE REMOVED
            this,
            "onSearchRequested()",
            Toast.LENGTH_LONG
        ).show()

        val appData = Bundle().apply {
            putBoolean("MY_DATA", true)
        }
        startSearch(null, false, appData, false)
        return true
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

    override fun onSharedPreferenceChanged(sharedPreferences: SharedPreferences, key: String?) {

        when(key){
            Utils.KEY_APP_USER_LAST_LOCATION -> {
                if(isAppUserAuthenticated) {
                    authModel.app_user?.location_address = Utils.getAppUserLocation(this) ?: ""
                }
            }
        }
    }
}
