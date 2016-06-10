<?php

include './base/app-util-base.php';

$app = new AppUtil();

updateCashBook($app);

function updateCashBook($app) {

    if (!$app->userSession->isBasicSessionAvailable()) {
        $app->sendSessionNotAvaliableJSON(null); //client side should ask the user to login or redirect the user to login page
        return;
    }


    $serial_no = $app->getInputPOST('cash_book_serial_no');
    $date = $app->getInputPOST('cash_book_date');
    $bank_name = $app->getInputPOST('cash_book_bank');
    $account_name = $app->getInputPOST('cash_book_account_name');
    $account_no = $app->getInputPOST('cash_book_account_no');
    $trancode = $app->getInputPOST('cash_book_tran_code');
    $description = $app->getInputPOST('cash_book_description');
    $debit = $app->getInputPOST('cash_book_debit');
    $credit = $app->getInputPOST('cash_book_credit');

    if ($date === FALSE || $bank_name  === FALSE|| $account_name === FALSE
            || $account_no === FALSE || $trancode === FALSE
            || $description === FALSE || $debit  === FALSE|| $credit === FALSE) {
        return $app->sendErrorJSON("Please try again!");
    }

    try {
        
        $stmt = $app->sqlUpdate("cash_book", "TRANDATE =?, "
                . "TRANCODE =?, BANK =?, ACCOUNT_NAME =?, ACCOUNT_NO =?, "
                . " DEBIT =?, CREDIT =?, REMARKS =?, ENTRY_DATETIME=now()",
                /* where */ "SN =? AND ENTRY_USER_ID=?", "?,?,?,?,?,?,?,?,?,?",
                array($date, $trancode, $bank_name, $account_name, $account_no, $debit, $credit, $description,
                            $serial_no, $app->userSession->getSessionUsername()));

        if ($stmt->rowCount() > 0) {
            $app->sendSuccessJSON("The operation was successfully!", null);
            $stmt->closeCursor();
            return;
        } else {
            //check if the reason is because the user was not the one who added the record in the first place.
            //to know that we can check if the record exists
            $app->handleUnauthorizedOperation("cash_book", "SN", "SN =?", array($serial_no));
        }
    } catch (Exception $exc) {
        return $app->sendErrorJSON("Please try again!");
        //echo $exc->getTraceAsString();
    }
}
