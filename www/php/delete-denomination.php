<?php

require './base/app-util-base.php';

$app = new AppUtil();

deleteDenomination($app);

function deleteDenomination($app) {

    if (!$app->userSession->isBasicSessionAvailable()) {
        $app->sendSessionNotAvaliableJSON(null); //client side should ask the user to login or redirect the user to login page
        return;
    }

    $denomination = $app->getInputPOST('monetary-delete-denomination'); // REMIND: element name unused

    if ($denomination === FALSE) {
        return $app->sendErrorJSON("Please try again!");
    }

    $stmt = $app->sqlDelete("add_denomination", "DENOMINATION=? AND ENTRY_USER_ID=?", array($denomination, $app->userSession->getSessionUsername()));

    if ($stmt->rowCount() > 0) {
        $app->sendSuccessJSON("Denomination deleted successfully!", null);
        $stmt->closeCursor();
        return;
    } else {
        //check if the reason is because the user was not the one who added the record in the first place.
        //to know that we can check if the record exists
        $app->handleUnauthorizedOperation("add_denomination", "DENOMINATION", "DENOMINATION =?", array($denomination));
        
    }
}
