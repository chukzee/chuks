<?php

require './base/app-util-base.php';

$app = new AppUtil();

deleteExpenseCategory($app);

function deleteExpenseCategory($app) {

    if (!$app->userSession->isBasicSessionAvailable()) {
        $app->sendSessionNotAvaliableJSON(null); //client side should ask the user to login or redirect the user to login page
        return;
    }

    $category = $app->getInputPOST('monetary-delete-expense-category'); // REMIND: element name unused

    if ($category === FALSE) {
        return $app->sendErrorJSON("Please try again!");
    }

    $stmt = $app->sqlDelete("add_expense_category", "EXPENSE_CATEGORY=? AND ENTRY_USER_ID=?", array($category, $app->userSession->getSessionUsername()));

    if ($stmt->rowCount() > 0) {
        $app->sendSuccessJSON("Expense category deleted successfully!", null);
        $stmt->closeCursor();
        return;
    } else {
        //check if the reason is because the user was not the one who added the record in the first place.
        //to know that we can check if the record exists
        $app->handleUnauthorizedOperation("add_expense_category", "EXPENSE_CATEGORY", "EXPENSE_CATEGORY =?", array($category));
        
    }
}
