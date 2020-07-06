package com.beepmemobile.www.location

import android.app.IntentService
import android.content.Intent
import com.beepmemobile.www.util.Utils.setLocationUpdatesResult
import com.google.android.gms.location.LocationResult

/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * Handles incoming location updates and displays a notification with the location data.
 *
 * For apps targeting API level 25 ("Nougat") or lower, location updates may be requested
 * using [android.app.PendingIntent.getService] or
 * [android.app.PendingIntent.getBroadcast]. For apps targeting
 * API level O, only `getBroadcast` should be used.
 *
 * Note: Apps running on "O" devices (regardless of targetSdkVersion) may receive updates
 * less frequently than the interval specified in the
 * [com.google.android.gms.location.LocationRequest] when the app is no longer in the
 * foreground.
 */
class LocationUpdatesIntentService : IntentService(TAG) {


    companion object {

        private const val ACTION_PROCESS_UPDATES = "com.beepmemobile.www.action.PROCESS_UPDATES"
        private val TAG = LocationUpdatesIntentService::class.java.simpleName
    }

    override fun onHandleIntent(intent: Intent?) {
        if (intent != null) {
            val action = intent.action
            if (ACTION_PROCESS_UPDATES == action) {
                val result = LocationResult.extractResult(intent)
                if (result != null) {
                    val locations =
                        result.locations
                    setLocationUpdatesResult(this, locations)

                }
            }
        }
    }

}