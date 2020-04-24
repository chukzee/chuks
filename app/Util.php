<?php

namespace App;

use Carbon\Carbon;

class Util {

   static function timeAgo($date) {       
        $dt = Carbon::parse($date);
        return $dt->diffForHumans();
    }
    
    static function monthDayYear($date){
        return Carbon::parse($date)->format('F d, Y');
    }
    
    static function monthDay($date){
        return Carbon::parse($date)->format('F d');
    }
    
    static function appDayDate($date){
        $dt = Carbon::parse($date);
        $days_diff = $dt->diffInDays(Carbon::now());
        $str = '';
        if($dt->isToday()){
            $str = 'Today, '. $dt->format('H:i');
        }else if($dt->isYesterday()){
            $str = 'Yesterday, '. $dt->format('H:i');
        }else if($days_diff <= 7){
            $str = $dt->shortDayName. ', '. static::monthDay($date);
        }else if($dt->isSameYear($date)){
            $str = static::monthDay($date);
        }else{
            $str = static::monthDayYear($date);
        }
        return $str;
    }
    
    static function getNigerianBanks(){
        return ['FirstBank', 'Fedelity', 'Unioun', 'FCMB'];
    }
    
    static function getNigerianStates(){
        return ['Delta', 'Edo', 'Enugu', 'Lagos'];
    }
    
    static function getTicketTypes(){
        return ['Keke', 'Car', 'Bus','NURTW'];
    }
}
