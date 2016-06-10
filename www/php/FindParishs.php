<?php

include './base/app-util-base.php';

$app = new AppUtil();


findParishs($app);

function findParishs($app) {

    try {
        $stmt = $app->conn->prepare("SELECT PARISH_NAME "
                . " FROM "
                . " parish_register"
                . " WHERE "
                . " UNDER_AREA =? "
                . " AND"
                . " UNDER_ZONE =? "
                . " AND"
                . " UNDER_PROVINCE =? "
                . " AND"
                . " UNDER_REGION =? "
                . " AND"
                . " UNDER_NATIONAL =? "
                . " AND"
                . " PARISH_NAME !='' "
                . " AND"
                . " PARISH_NAME != NULL");

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $parish_names = array();
        $index = -1;
        while ($stmt->rowCount() > 0) {
            $index++;
            $parish_names[$index] = $row["PARISH_NAME"];
        }
        $stmt->closeCursor();
        $app->sendSuccessJSON("Successful!", $parish_names);
        
    } catch (Exception $exc) {
        $app->sendErrorJSON("Please try again later! ");
    }

}