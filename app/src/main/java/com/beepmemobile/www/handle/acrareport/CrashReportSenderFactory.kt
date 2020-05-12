package com.beepmemobile.www.handle.acrareport

import android.content.Context
import org.acra.config.CoreConfiguration
import org.acra.sender.ReportSender
import org.acra.sender.ReportSenderFactory

import androidx.annotation.NonNull


class CrashReportSenderFactory : ReportSenderFactory {

    override fun create(context: Context, config: CoreConfiguration): ReportSender {
        return CrashReportSender(context, config)
    }

    override fun enabled(coreConfig: CoreConfiguration): Boolean {
        return true
    }
}