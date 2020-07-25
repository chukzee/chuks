<?php
namespace App\Util;
define('UPLOAD_DIR', '/uploads/');

class Constants{
     const SOMETHING_WENT_WRONG = 'Something went wrong!';
     const USER_NOT_FOUND = 'User not found!';
     const MESSAGE_SENT = 'Message sent';
     const INVALID_INPUT = 'Invalid input!';
     
     const DEFAULT_UPLOAD_DIR = UPLOAD_DIR;
     const DEFAULT_UPLOAD_PROFILE_DIR = UPLOAD_DIR.'profiles/';
}
