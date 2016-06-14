<?php

require './base/app-util-base.php';

$app = new AppUtil();

registerParish($app);

function registerParish($app) {

    try {
        $parish_name = $app->getInputPOST('register-parish-name');
        $parish_address = $app->getInputPOST('register-parish-address');
        $parish_head_of = $app->getInputPOST('rregister-parish-head-of');
        $division_name = $app->getInputPOST('register-parish-division-name');
        $under_area = $app->getInputPOST('register-parish-under-area');
        $under_zone = $app->getInputPOST('register-parish-under-zone');
        $under_province = $app->getInputPOST('register-parish-under-province');
        $under_region = $app->getInputPOST('register-parish-under-region');
        $under_national = $app->getInputPOST('register-parish-under-national');


        if ($parish_name === FALSE || $parish_address === FALSE || $parish_head_of === FALSE || $division_name === FALSE || $under_area === FALSE || $under_zone === FALSE || $under_province === FALSE || $under_region === FALSE || $under_national === FALSE) {
            return $app->sendErrorJSON("Could not register parish.\nPlease try again!");
        }


        $stmt = $app->conn->prepare("INSERT INTO "
                . "parish_register"
                . " (PARISH_SN, PARISH_NAME, PARISH_ADDRESS, UNDER_AREA, UNDER_ZONE,UNDER_PROVINCE,UNDER_REGION,UNDER_NATIONAL)"
                . "VALUES(0,?,?,?,?,?,?,?");

        $stmt->execute(array($parish_name, $parish_address, $under_area, $under_zone, $under_province, $under_region, $under_national));

        $success = false;
        if ($stmt->rowCount() > 0) {
            $stmt->closeCursor();
            If ($parish_head_of != null && $parish_head_of != '') {
                $success = false;
                $stmt = $app->conn->prepare("INSERT INTO "
                        . "head_parishes"
                        . " (SN, PARISH_NAME, HEAD_CATEGORY, DIVISION_NAME,PARISH_SN)"
                        . "VALUES(0,?,?,?,LAST_INSERT_ID()");

                $stmt->execute(array($parish_name, $parish_head_of, $division_name));
                if ($stmt->rowCount() > 0) {
                    $success = true;
                    $stmt->closeCursor();
                }
            } else {
                $success = true;
            }
        }

        if ($success) {
            $app->sendSuccessJSON("Parish was successfully registered!", null);
        } else {
            $app->sendErrorJSON("Parish not registered!");
        }
    } catch (Exception $exc) {
        $app->sendErrorJSON("Could not register you.\nPlease try again later!");
        return;
    }
}
