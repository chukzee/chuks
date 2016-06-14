<?php

require './base/app-util-base.php';

$app = new AppUtil();

deleteBankAccount($app);

function deleteBankAccount($app) {

    if (!$app->userSession->isBasicSessionAvailable()) {
        $app->sendSessionNotAvaliableJSON(null); //client side should ask the user to login or redirect the user to login page
        return;
    }

    $bank_name = $app->getInputPOST('monetary-delete-bank-account-bank'); // REMIND: element name unused
    $account_no = $app->getInputPOST('monetary-delete-bank-account-no'); // REMIND: element name unused

    if ($bank_name  === FALSE|| $account_no === FALSE) {
        return $app->sendErrorJSON("Please try again!");
    }

    $stmt = $app->sqlDelete("add_bank_account", "BANK_NAME=? AND  ACCOUNT_NO=? AND ENTRY_USER_ID=?", array($bank_name,$account_no, $app->userSession->getSessionUsername()));

    if ($stmt->rowCount() > 0) {
        $app->sendSuccessJSON("Bank account deleted successfully!", null);
        $stmt->closeCursor();
        return;
    } else {
        //check if the reason is because the user was not the one who added the record in the first place.
        //to know that we can check if the record exists
        $app->handleUnauthorizedOperation("add_bank_account", "ACCOUNT_NO", "BANK_NAME =? AND  ACCOUNT_NO=?", array($bank_name, $account_no));
        
    }
}
