package com.beepmemobile.www.util


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

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.graphics.BitmapFactory
import android.graphics.Color
import android.location.Location
import android.os.Build
import androidx.preference.PreferenceManager
import androidx.core.app.TaskStackBuilder
import com.beepmemobile.www.R
import com.beepmemobile.www.location.LocationActivity


/**
 * Utility methods.
 */
internal object Utils {

    const val KEY_LOCATION_UPDATES_REQUESTED = "location-updates-requested"
    const val KEY_LOCATION_UPDATES_RESULT = "location-update-result"
    const val KEY_APP_USER_LAST_LOCATION = "KEY_APP_USER_LAST_LOCATION"
    const val CHANNEL_ID = "channel_01"
    fun setRequestingLocationUpdates(
        context: Context?,
        value: Boolean
    ) {
        PreferenceManager.getDefaultSharedPreferences(context)
            .edit()
            .putBoolean(KEY_LOCATION_UPDATES_REQUESTED, value)
            .apply()
    }

    fun getRequestingLocationUpdates(context: Context?): Boolean {
        return PreferenceManager.getDefaultSharedPreferences(context)
            .getBoolean(KEY_LOCATION_UPDATES_REQUESTED, false)
    }

    /**
     * Posts a notification in the notification bar when a transition is detected.
     * If the user clicks the notification, control goes to the LocationActivity.
     */
    fun sendNotification(
        context: Context,
        notificationDetails: String?
    ) {
        // Create an explicit content Intent that starts the main Activity.
        val notificationIntent = Intent(context, LocationActivity::class.java)
        notificationIntent.putExtra("from_notification", true)

        // Construct a task stack.
        val stackBuilder: TaskStackBuilder = TaskStackBuilder.create(context)

        // Add the main Activity to the task stack as the parent.
        stackBuilder.addParentStack(LocationActivity::class.java)

        // Push the content Intent onto the stack.
        stackBuilder.addNextIntent(notificationIntent)

        // Get a PendingIntent containing the entire back stack.
        val notificationPendingIntent: PendingIntent =
            stackBuilder.getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT)!!

        if(notificationPendingIntent == null){//Added by chuks
            return
        }

        // Get a notification builder that's compatible with platform versions >= 4
        val builder: Notification.Builder = Notification.Builder(context)

        // Define the notification settings.
        builder.setSmallIcon(R.mipmap.ic_launcher) // In a real app, you may want to use a library like Volley
            // to decode the Bitmap.
            .setLargeIcon(
                BitmapFactory.decodeResource(
                    context.resources,
                    R.mipmap.ic_launcher
                )
            )
            .setColor(Color.RED)
            .setContentTitle("Location update")
            .setContentText(notificationDetails)
            .setContentIntent(notificationPendingIntent)

        // Dismiss notification once the user touches it.
        builder.setAutoCancel(true)

        // Get an instance of the Notification manager
        val mNotificationManager =
            context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        // Android O requires a Notification Channel.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name: CharSequence = context.getString(com.beepmemobile.www.R.string.app_name)
            // Create the channel for the notification
            val mChannel =
                NotificationChannel(CHANNEL_ID, name, NotificationManager.IMPORTANCE_DEFAULT)

            // Set the Notification Channel for the Notification Manager.
            mNotificationManager.createNotificationChannel(mChannel)

            // Channel ID
            builder.setChannelId(CHANNEL_ID)
        }

        // Issue the notification
        mNotificationManager.notify(0, builder.build())
    }


    fun setLocationUpdatesResult(
        context: Context,
        locations: List<Location>
    ) {

        if(locations.isEmpty()) return

       val lastLocation = Util.formatLocation(context, locations.last())


        PreferenceManager.getDefaultSharedPreferences(context)
            .edit()
            .putString(KEY_APP_USER_LAST_LOCATION, lastLocation)
            .apply()

        //TODO send the user location to the server


    }

    fun getAppUserLocation(context: Context?): String? {
        return PreferenceManager.getDefaultSharedPreferences(context)
            .getString(KEY_APP_USER_LAST_LOCATION, "")
    }

    fun getLocationUpdatesResult(context: Context?): String? {
        return PreferenceManager.getDefaultSharedPreferences(context)
            .getString(KEY_LOCATION_UPDATES_RESULT, "")
    }

}