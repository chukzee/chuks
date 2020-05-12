package com.beepmemobile.www

import android.content.Context
import androidx.multidex.MultiDexApplication
import com.beepmemobile.www.handle.acrareport.*
import org.acra.ACRA
import org.acra.annotation.AcraCore
import org.acra.config.CoreConfigurationBuilder
import org.acra.config.DialogConfigurationBuilder
import org.acra.data.StringFormat

//@AcraCore(reportSenderFactoryClasses = arrayOf(CrashReportSenderFactory::class))
class BeepMeApp : MultiDexApplication(){

    override fun onCreate() {
            super.onCreate()
    }

    override fun attachBaseContext(base: Context?) {
        super.attachBaseContext(base)

                 val builder = CoreConfigurationBuilder(this).also {

                    it.setBuildConfigClass(BuildConfig::class.java)
                        .setReportFormat(StringFormat.JSON)

                    /*it.getPluginConfigurationBuilder(CoreConfigurationBuilder::class.java)
                        .setReportSenderFactoryClasses(CrashReportSenderFactory::class.java)
                        .setApplicationLogFile("beepme.txt")
                        .setEnabled(true)*/


                     it.getPluginConfigurationBuilder(DialogConfigurationBuilder::class.java)
                         .setTitle("Error")
                         .setText("An error occurred!")
                         .setPositiveButtonText("Ok, Got It!")
                         .setNegativeButtonText("Close")
                         .setReportDialogClass(BeepMeCrashReportDialog::class.java)
                         .setEnabled(true)
            }


            ACRA.init(this, builder)



    }
}