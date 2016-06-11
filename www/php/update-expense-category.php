<?php

include './base/app-util-base.php';

$app = new AppUtil();

updateExpenseCategory($app);

function updateExpenseCategory($app) {

    if (!$app->userSession->isBasicSessionAvailable()) {
        $app->sendSessionNotAvaliableJSON(null); //client side should ask the user to login or redirect the user to login page
        return;
    }

    $category = $app->getInputPOST('monetary-update-expense-category'); // REMIND: element name unused

    if ($category === FALSE) {
        return $app->sendErrorJSON("Please try again!");
    }
    try {


        $stmt = $app->sqlUpdate("add_expense_category", "EXPENSE_CATEGORY=?", "EXPENSE_CATEGORY=? AND ENTRY_USER_ID=?", array($category, $category, $app->userSession->getSessionUsername()));

        if ($stmt->rowCount() > 0) {
            $app->sendSuccessJSON("Expense category updated successfully!", null);
            $stmt->closeCursor();
            return;
        } else {
            //check if the reason is because the user was not the one who added the record in the first place.
            //to know that we can check if the record exists
            $app->handleUnauthorizedOperation("add_expense_category", "EXPENSE_CATEGORY", "EXPENSE_CATEGORY =?", array($category));
        }
    } catch (Exception $exc) {
        return $app->sendErrorJSON("Please try again!");
    }
}
