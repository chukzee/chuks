<?php

require './base/app-util-base.php';

$app = new AppUtil();

updateDenomination($app);

function updateDenomination($app) {

    if (!$app->userSession->isBasicSessionAvailable()) {
        $app->sendSessionNotAvaliableJSON(null); //client side should ask the user to login or redirect the user to login page
        return;
    }

    $denomination = $app->getInputPOST('DENOMINATION');
    $sn = $app->getInputPOST('SN');
    
    if ( $sn === FALSE || $denomination === FALSE) {
        return $app->sendErrorJSON("Please try again!");
    }
    try {


        $stmt = $app->sqlUpdate("add_denomination", "DENOMINATION=?", "SN=? AND ENTRY_USER_ID=?", array($denomination, $sn, $app->userSession->getSessionUsername()));

        if ($stmt->rowCount() > 0) {
            $app->sendSuccessJSON("Denomination updated successfully!", null);
        } else {
                //check if the reason is because the user was not the one who added the bank in the first place.
                //to know that we can check if the bank name exists
                if ($app->checkAuthorizedOperation("add_denomination", "SN", $sn)) {
                    $this->sendIgnoreJSON("Nothing updated!");
                } else {
                    $this->sendUnauthorizedOperationJSON("You cannot update a record that does not originate from you!");
                }
        }
        $stmt->closeCursor();
        
    } catch (Exception $exc) {
        return $app->sendErrorJSON("Please try again!");
    }
}
