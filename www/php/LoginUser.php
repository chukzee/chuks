<?php

include './base/app-util-base.php';

$app = new AppUtil();

loginUser($app);

function loginUser($app) {

    $username = $app->getInputPOST('txt_login_username');
    $password = $app->getInputPOST('txt_login_password');
    $group = $app->getInputPOST('cbo_login_group');
    $role = $app->getInputPOST('cbo_login_role');

    if ($username === FALSE || $password === FALSE || $group === FALSE || $role === FALSE) {
        return $app->sendErrorJSON("Could not login.\nPlease try again!");
    }

    try {

        $stmt = $app->sqlSelect("register", "*", "BINARY USERNAME =? AND BINARY PASSWORD=SHA($password) AND BINARY DEPARTMENT=? AND BINARY ROLE=?", array($username, $group, $role));

        $row = $stmt->fetch(PDO::FETCH_OBJ);
        
        if ($stmt->rowCount() > 0) {
            $user = new User();
            $user->home_page = $row->$column_name = "PARISH_SN";
            $user->first_name = $row->$column_name = "PARISH_SN";
            $user->last_name = $row->$column_name = "PARISH_SN";
            $user->middle_name = $row->$column_name = "PARISH_SN";
            $user->dob = $row->$column_name = "PARISH_SN";
            $user->birth_day = $row->$column_name = "PARISH_SN";
            $user->age_range = $row->$column_name = "PARISH_SN";
            $user->sex = $row->$column_name = "PARISH_SN";
            $user->address = $row->$column_name = "PARISH_SN";
            $user->email = $row->$column_name = "PARISH_SN";
            $user->verified_email = $row->$column_name = "PARISH_SN";
            $user->phone_numbers = $row->$column_name = "PARISH_SN";
            $user->date_converted = $row->$column_name = "PARISH_SN";
            $user->membership_date = $row->$column_name = "PARISH_SN";
            $user->photo_url = $row->$column_name = "PARISH_SN";
            $user->designation = $row->$column_name = "PARISH_SN";
            $user->dept = $row->$column_name = "PARISH_SN";
            $user->group = $row->$column_name = "PARISH_SN";
            $user->role = $row->$column_name = "PARISH_SN";
            $user->uneditable_features = $row->$column_name = "PARISH_SN";
            $user->unviewable_features = $row->$column_name = "PARISH_SN";
            $user->parish = $row->$column_name = "PARISH_SN";
            $user->area = $row->$column_name = "PARISH_SN";
            $user->zone = $row->$column_name = "PARISH_SN";
            $user->province = $row->$column_name = "PARISH_SN";
            $user->region = $row->$column_name = "PARISH_SN";
        } else {
            $app->sendErrorJSON("Invalid username or pasword or access level!");
        }
    } catch (Exception $e) {
        $app->sendErrorJSON("Please try again later!");
    }
}