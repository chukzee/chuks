<?php

include './base/app-util-base.php';

$app = new AppUtil();

deleteCashBook($app);

function deleteCashBook($app) {

    if (!$app->userSession->isBasicSessionAvailable()) {
        $app->sendSessionNotAvaliableJSON(null); //client side should ask the user to login or redirect the user to login page
        return;
    }


    $entry_serial_no = $app->getInputPOST('cash_book_serial_no');

    if ($entry_serial_no === FALSE) {
        return $app->sendErrorJSON("Please try again!");
    }
 
        $stmt = $app->sqlDelete("cash_book", 
              /* where */ "SN =? AND ENTRY_USER_ID=?",
                array($entry_serial_no, $app->userSession->getSessionUsername()));

        if ($stmt->rowCount() > 0) {
            $app->sendSuccessJSON("The operation was successfully!", null);
            $stmt->closeCursor();
            return;
        } else {
            //check if the reason is because the user was not the one who added the record in the first place.
            //to know that we can check if the record exists
            $app->handleUnauthorizedOperation("cash_book", "SN", "SN =?", array($entry_serial_no));
        }
}
