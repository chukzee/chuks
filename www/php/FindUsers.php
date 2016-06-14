<?php

require './base/app-util-base.php';

$app = new AppUtil();

findUsers($app);

function findUsers($app) {

    $name_of_user = $app->getInputPOST('name_of_user');
    $search_limit = $app->getInputPOST('search_limit');

    if ($name_of_user === FALSE || $search_limit === FALSE) {
        return $app->sendErrorJSON("Please try again!");
    }

    try {
        $stmt = $app->conn->prepare("SELECT"
                . " * "
                . " FROM "
                . "  Browse register "
                . " WHERE "
                . " FIRST_NAME LIKE ? "
                . " OR "
                . " MIDDLE_NAME LIKE ? "
                . " OR "
                . " LAST_NAME LIKE ? "
                . " AND"
                . " PARISH_SN = ? ");


        $stmt->execute(array($name_of_user, $name_of_user, $name_of_user, $app->userSession->getSessionUserParishID()));

        $found_users_arr = array();
        $index = -1;
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $index++;
            $users = array();
            $users["username"] = $row["USERNAME"];
            $users["firstName"] = $row["FIRST_NAME"];
            $users["middleName"] = $row["MIDDLE_NAME"];
            $users["lastName"] = $row["LAST_NAME"];
            $users["dob"] = $row["DOB"];
            $users["birthday"] = $row["BIRTHDAY"];
            $users["ageRange"] = $row["AGE_RANGE"];
            $users["sex"] = $row["SEX"];
            $users["address"] = $row["ADDRESS"];
            $users["phoneNumbers"] = $row["PHONE_NUMBERS"];
            $users["email"] = $row["EMAIL"];
            $users["nationality"] = $row["NATIONALITY"];
            $users["dateConverted"] = $row["DATE_CONVERTED"];
            $users["membershipDate"] = $row["MEMBERSHIP_DATE"];
            $users["profilePhotoUrl"] = $row["PROFILE_PHOTO"];
            $users["designation"] = $row["DESIGNATION"];
            $users["department"] = $row["DEPARTMENT"];
                        
            $found_users_arr[$index] = $users;
        }
        
        $stmt->closeCursor();
        
        $app->sendSuccessJSON("Successful!", $found_users_arr);
    } catch (Exception $exc) {
        $app->sendErrorJSON("Please try again later! ");
    }
}
