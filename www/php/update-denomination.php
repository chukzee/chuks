<?php

include './base/app-util-base.php';

$app = new AppUtil();

updateDenomination($app);

function updateDenomination($app) {

    if (!$app->userSession->isBasicSessionAvailable()) {
        $app->sendSessionNotAvaliableJSON(null); //client side should ask the user to login or redirect the user to login page
        return;
    }

    $denomination = $app->getInputPOST('monetary-update-denomination'); // REMIND: element name unused

    if ($denomination === FALSE) {
        return $app->sendErrorJSON("Please try again!");
    }
    try {


        $stmt = $app->sqlUpdate("add_bank", "DENOMINATION=?", "DENOMINATION=? AND ENTRY_USER_ID=?", array($denomination, $denomination, $app->userSession->getSessionUsername()));

        if ($stmt->rowCount() > 0) {
            $app->sendSuccessJSON("Denomination updated successfully!", null);
            $stmt->closeCursor();
            return;
        } else {
            //check if the reason is because the user was not the one who added the record in the first place.
            //to know that we can check if the record exists
            $app->handleUnauthorizedOperation("add_denomination", "DENOMINATION", "DENOMINATION =?", array($denomination));
        }
    } catch (Exception $exc) {
        return $app->sendErrorJSON("Please try again!");
    }
}
