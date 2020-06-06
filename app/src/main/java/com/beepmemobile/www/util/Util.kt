package com.beepmemobile.www.util

import java.util.*


class Util {

    /**
       format to  time part only if today and from yesterday
        format as follow
        yesterday -> yesterday, 12:23
        this week -> fri, 12:00
        beyond that ->21 days 12:12
      */
    fun formatTime(date: Date):String{

        var dateStr =""
        var now = Date()
        var todayBegin = Date( now.year ,  now.month,  now.date,  0,  0)

        val sec = 1000.0
        val min = sec * 60.0
        val hr =  min * 60.0
        var day = hr * 24.0

        val calendar: Calendar = GregorianCalendar()
        calendar.time = date

        var hour = calendar[Calendar.HOUR_OF_DAY]
        var mins = calendar[Calendar.MINUTE]

        if(date.time >= todayBegin.time){//today
            dateStr = "Today, ${toTwoDigit(hour)}:${toTwoDigit(mins)}"
        }else if(date.time >= todayBegin.time - day){//yesterday
            dateStr = "Yesterday, ${toTwoDigit(hour)}:${toTwoDigit(mins)}"
        }else if(date.time >= todayBegin.time - 7 * day){//at least 7 days ago

            var day_of_week = calendar[Calendar.DAY_OF_WEEK]
            var day_name = ""
            when(day_of_week){
                0 -> day_name = "Sun"
                1 -> day_name = "Mon"
                2 -> day_name = "Tue"
                3 -> day_name = "Wed"
                4 -> day_name = "Thu"
                5 -> day_name = "Fri"
                6 -> day_name = "Sat"
            }

            dateStr = "$day_name, ${toTwoDigit(hour)}:${toTwoDigit(mins)}"

        }else{//greater than 7 days

            val year = calendar[Calendar.YEAR]
            var month = calendar[Calendar.MONTH]
            val day = calendar[Calendar.DAY_OF_MONTH]

            var month_name = ""
            when(month){
                0 -> month_name = "Jan"
                1 -> month_name = "Feb"
                2 -> month_name = "Mar"
                3 -> month_name = "Apr"
                4 -> month_name = "May"
                5 -> month_name = "Jun"
                6 -> month_name = "Jul"
                7 -> month_name = "Aug"
                8 -> month_name = "Sep"
                9 -> month_name = "Oct"
                10 -> month_name = "Nov"
                11 -> month_name = "Dec"
            }

            dateStr = "$month_name $day, $year"
        }

        return dateStr
    }

    private fun toTwoDigit(num: Int):String{
        return if (num < 10) "0"+num else ""+num
    }

    fun contentExcerpt(content: String):String{
        return contentExcerpt(content, 50)
    }

    fun contentExcerpt(content: String,  max_len: Int):String{
        var len = max_len;
        if(len < 0){
            len = 0;
        }

        if(len > content.length){
            len = content.length;
        }

        return content.substring(0..len-1)+"..."//come back abeg o!!!
    }
}