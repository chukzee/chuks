<?php

include './base/app-util-base.php';

$app = new AppUtil();

updateBank($app);

function updateBank($app) {

    if (!$app->userSession->isBasicSessionAvailable()) {
        $app->sendSessionNotAvaliableJSON(null); //client side should ask the user to login or redirect the user to login page
        return;
    }

    $bank_name = $app->getInputPOST('monetary-update-bank'); // REMIND: element name unused

    if ($bank_name === FALSE) {
        return $app->sendErrorJSON("Please try again!");
    }

    $stmt = $app->sqlUpdate("add_bank", "BANK_NAME=?", "BANK_NAME=? AND ENTRY_USER_ID=?", array($bank_name, $bank_name, $app->userSession->getSessionUsername()));

    if ($stmt->rowCount() > 0) {
        $app->sendSuccessJSON("Bank name updated successfully!", null);
        $stmt->closeCursor();
        return;
    } else {
        //check if the reason is because the user was not the one who added the bank in the first place.
        //to know that we can check if the bank name exists
        $app->handleUnauthorizedOperation("add_bank", "BANK_NAME", "BANK_NAME =?", array($bank_name));
    }
}
