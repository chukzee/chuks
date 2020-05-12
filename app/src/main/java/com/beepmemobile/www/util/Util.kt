package com.beepmemobile.www.util

import java.util.*

class Util {

    fun formatTime(date: Date):String{
        /*TODO format to  time part only if today and from yesterday
        format as follow
        yesterday -> yesterday, 12:23
        this week -> fri, 12:00
        beyond that ->2 days 12:12

         */

        return "date.toString()"
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