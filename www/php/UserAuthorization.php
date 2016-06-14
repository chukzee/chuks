<?php

require './base/app-util-base.php';

$app = new AppUtil();

userAuthorization($app);

function userAuthorization($app) {

    try {

        if (!$app->userSession->isBasicSessionAvailable()) {
            $app->sendSessionNotAvaliableJSON(null); //client side should ask the user to login or redirect the user to login page
            return;
        }
        
        $authorization_username = $app->getInputPOST('authorization_username');
        $authorization_designation = $app->getInputPOST('authorization_designation');
        $authorization_block_user = $app->getInputPOST('authorization_block_user');
        $authorization_admin = $app->getInputPOST('authorization_admin');
        $authorization_accountant = $app->getInputPOST('authorization_accountant');
        $authorization_pastor = $app->getInputPOST('authorization_pastor');
        $authorization_worker = $app->getInputPOST('authorization_worker');
        $authorization_men_exco = $app->getInputPOST('authorization_men_exco');
        $authorization_women_exco = $app->getInputPOST('authorization_women_exco');
        $authorization_youth_exco = $app->getInputPOST('authorization_youth_exco');
        $authorization_member = $app->getInputPOST('authorization_member');
        $authorization_children = $app->getInputPOST('authorization_children');

        //$uneditable_features = $app->getInputPOST('uneditable_features');
        $viewable_features = $app->getInputPOST('viewable_features');

        if ($authorization_username === FALSE || $authorization_designation === FALSE || $authorization_block_user === FALSE || $authorization_admin === FALSE || $authorization_accountant === FALSE || $authorization_pastor === FALSE || $authorization_worker === FALSE || $authorization_men_exco === FALSE || $authorization_women_exco === FALSE || $authorization_youth_exco === FALSE || $authorization_member === FALSE || $authorization_children === FALSE || $viewable_features === FALSE
        //COME BACK FOR $viewable_features
        ) {
            return $app->sendErrorJSON("Please try again!");
        }

        $group_list = "";
        if ($authorization_admin != '') {
            $group_list.=$authorization_admin . ',';
        }

        if ($authorization_accountant != '') {
            $group_list.=$authorization_accountant . ',';
        }
        if ($authorization_pastor != '') {
            $group_list.=$authorization_pastor . ',';
        }
        if ($authorization_worker != '') {
            $group_list.=$authorization_worker . ',';
        }
        if ($authorization_men_exco != '') {
            $group_list.=$authorization_men_exco . ',';
        }
        if ($authorization_women_exco != '') {
            $group_list.=$authorization_women_exco . ',';
        }
        if ($authorization_youth_exco != '') {
            $group_list.=$authorization_youth_exco . ',';
        }
        if ($authorization_member != '') {
            $group_list.=$authorization_member . ',';
        }
        if ($authorization_children != '') {
            $group_list.=$authorization_children . ',';
        }
        
        $stmt = $app->conn->prepare("UPDATE "
                . " register "
                . " SET "
                . " USER_GROUPS = ?"
                . " AND "
                . " UNVIEWABLE_FEATURES = ?"
                . " AND "
                . " ENTRY_USER_ID = ?"
                . " AND "
                . " ENTRY_DATETIME = NOW()"
                . " WHERE "
                . " USERNAME = ?");

        $stmt->execute(array($group_list, $viewable_features,$app->userSession->getSessionUsername(), $authorization_username));

        if ($stmt->rowCount() > 0) {
            $stmt->closeCursor();
            $app->sendSuccessJSON("Successful!", null);
        } else {
            $app->sendIgnoreJSON("Nothing updated!");
        }
    } catch (Exception $exc) {
        $app->sendErrorJSON("Please try again later!");
        return;
    }
}
