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

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $user = new User();
            $user->firstName = $row["FIRST_NAME"];
            $user->lastName = $row["LAST_NAME"];
            $user->middleName = $row["MIDDLE_NAME"];
            $user->dob = $row["DOB"];
            $user->birthday = $row["BIRTH_DAY"];
            $user->ageRange = $row["AGE_RANGE"];
            $user->sex = $row["SEX"];
            $user->address = $row["ADDRESS"];
            $user->email = $row["EMAIL"];
            $user->verifiedEmail = $row["VERIFIED_EMAIL"];
            $user->phoneNumbers = $row["PHONE_NUMBERS"];
            $user->dateconverted = $row["DATE_CONVERTED"];
            $user->membershipDate = $row["MEMBERSHIP_DATE"];
            $user->photoUrl = $row["PROFILE_PHOTO"];
            $user->designation = $row["DESIGNATION"];
            $user->dept = $row["DEPARTMENT"];
            $user->group = $row["GROUP"];
            $user->role = $row["ROLE"];
            $user->uneditableFeatures = $row["UNEDITABLE_FEATURES"];
            $user->unviewableFeatures = $row["UNVIEWABLE_FEATURES"];
            
            $parish_sn = $row["PARISH_SN"];

            $stmt2 = $app->sqlSelect("parish_register", "*", "PARISH_SN =?", array($parish_sn));

            if ($row2 = $stmt2->fetch(PDO::FETCH_ASSOC)) {
                $user->parishName = $row2["PARISH_NAME"];
                $user->parishAddress = $row2["PARISH_ADDRESS"];
                $user->parishLogitutude = $row2["LONGITUDE"];
                $user->parishLatitude = $row2["LATITUDE"];
                $user->area = $row2["UNDER_AREA"];
                $user->zone = $row2["UNDER_ZONE"];
                $user->province = $row2["UNDER_PROVINCE"];
                $user->region = $row2["UNDER_REGION"];
                $user->national = $row2["UNDER_NATIONAL"];
            }
            $data = array();
            $data["user"] = $user;
            
            $data["carouselImages"] = array(); //come back
            $data["newsContent"] = array(); //come back
            
            $app->sendSuccessJSON("Successfully!", $data);
        } else {
            $app->sendErrorJSON("Invalid username or pasword or access level!");
        }
    } catch (Exception $e) {
        $app->sendErrorJSON("Please try again later!");
    }
}
