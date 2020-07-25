<?php

namespace App\Util;

class Result {

    public $success = false;
    public $data = '';
    public $msg = '';
    public $errMsg = '';
    public $debugMsg = '';
    public $stackTraceMsg = '';

    function success($value = null) {
        if($value != null){
            $this->msg = $value;
        }
        $this->success = true;
        return $this;
    }

    function error($err, $value = null) {
        if($err != null){
            $this->errMsg = $err;
        }
        if($value != null){
            $this->data = $value;
        }
        $this->success = false;
        return $this;
    }

    function successJson($value = null) {
        return json_encode($this->successArray($value));
    }

    function successArray($value = null) {
        return (array)$this->success($value);
    }

    function errorJson($err, $value = null) {
        return json_encode($this->errorArray($err, $value));
    }

    function errorArray($err, $value = null) {
        return (array)$this->error($err, $value);
    }

    function debugJson($ex, $value = null) {        
        return json_encode($this->debugArray($ex, $value));
    }

    function debugArray($ex, $value = null){
        if($ex != null){
            $this->debugMsg = $ex->getMessage();
            $this->stackTraceMsg = $ex->getTraceAsString();
        }
        if($value != null){
            $this->data = $value;
        }
        return (array) $this->error(Constants::SOMETHING_WENT_WRONG, $value);
    }
    
    function dataJson($send = ''){
        return json_encode($this->dataArray($send));
    }
    
    function dataArray($send = ''){
        $this->data = $send;
        return $this->successArray();
    }
    
    function json() {
        return json_encode($this);
    }
    function toArray() {        
        return (array)$this;
    }

}
