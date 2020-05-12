package com.beepmemobile.www.handle.acrareport

import android.app.AlertDialog
import android.content.DialogInterface
import android.os.Bundle
import android.widget.Toast
import org.acra.ReportField
import org.acra.data.CrashReportDataFactory
import org.acra.dialog.*

class BeepMeCrashReportDialog : CrashReportDialog() {

    override fun onCreate(savedInstanceState: Bundle?) {


        /* val ch = CrashReportDialogHelper(this, this.intent)

         Toast.makeText(
             this,
             ch.reportData.getString(ReportField.STACK_TRACE),
             Toast.LENGTH_LONG
         )*/

        super.onCreate(savedInstanceState)



    }

    override fun buildAndShowDialog(savedInstanceState: Bundle?) {

        val ch = CrashReportDialogHelper(this, this.intent)

        AlertDialog.Builder(this)
            .setTitle("Error")
            .setMessage(ch.reportData.getString(ReportField.STACK_TRACE))
            .create()
            .show()



        //super.buildAndShowDialog(savedInstanceState)
    }
}