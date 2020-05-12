package com.beepmemobile.www.handle.acrareport

import android.content.Context
import android.util.Log
import android.widget.Toast
import org.acra.ReportField
import org.acra.config.CoreConfiguration
import org.acra.data.CrashReportData
import org.acra.sender.ReportSender
import java.io.File
import java.io.FileOutputStream


class CrashReportSender(
    context: Context,
    config: CoreConfiguration
) :ReportSender {
    private val FILE_NAME = "AcraReport.txt"

    override fun send(context: Context, errorContent: CrashReportData) {
        //errorContent.toString()
        //errorContent.toJSON()
        //errorContent.toMap()
        /*AlertDialog.Builder(context)
            .setTitle("Error")
            .setMessage(errorContent.toString())
            .create()
            .show()*/

        val finalReport = createCrashReport(errorContent)
        val tempFile = context.filesDir.path.toString() + "/" + FILE_NAME

        try {
            val detailedFile = File(tempFile)
            if (!detailedFile.exists()) detailedFile.createNewFile()
            val stream = FileOutputStream(detailedFile, true)
            stream.write(finalReport!!.toByteArray())
            Log.d("testAcra", "adding to file: $stream")
            stream.close()
        } catch (e: Exception) {
            e.printStackTrace()
        }

        Toast.makeText(context, finalReport, Toast.LENGTH_LONG)

        //TODO LOAD A DIALOG TO DISPLAY THE REPORT using CrashReportData
    }

    private fun createCrashReport(crashReportData: CrashReportData): String? {
        val body = StringBuilder()
        body.append("ReportID : " + crashReportData.getString(ReportField.REPORT_ID))
            .append("\n")
            .append("DeviceID : " + crashReportData.getString(ReportField.DEVICE_ID))
            .append("\n")
            .append("AppVersionName : " + crashReportData.getString(ReportField.APP_VERSION_NAME))
            .append("\n")
            .append("Android Version : " + crashReportData.getString(ReportField.ANDROID_VERSION))
            .append("\n")
            .append("CustomData : " + crashReportData.getString(ReportField.CUSTOM_DATA))
            .append("\n")
            .append(
                """
                    STACK TRACE : 
                    ${crashReportData.getString(ReportField.STACK_TRACE)}
                    """.trimIndent()
            )
            .append("\n")
            .append(
                """
                    LogCAT : 
                    ${crashReportData.getString(ReportField.LOGCAT)}
                    """.trimIndent()
            )
        return body.toString()
    }
}