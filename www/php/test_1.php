<?php

class Divison {
    public $name =null;
    public $age =null;
    public function __construct() {
        
    }
}

require './base/app-util-base.php';

$b = array();
$b["name"] = 'okore';
$b["age"] = 32;

$d = new Divison;
$d->name = 'okora';
$d->age = 33;

echo json_encode($b).'<br/>';
echo json_encode($d);