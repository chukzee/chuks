<?php

include './base/app-util-base.php';

$app = new AppUtil();

logOutUser($app);

function logOutUser($app) {
    
    session_unset();
    session_destroy();
    session_write_close();
    setcookie(session_name(),'',0,'/');
    
    

}