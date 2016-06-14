<?php

require './base/app-util-base.php';

$app = new AppUtil();

updateIncomeCategory($app);

function updateIncomeCategory($app) {

    if (!$app->userSession->isBasicSessionAvailable()) {
        $app->sendSessionNotAvaliableJSON(null); //client side should ask the user to login or redirect the user to login page
        return;
    }

    $category = $app->getInputPOST('monetary-update-income-category'); // REMIND: element name unused

    if ($category === FALSE) {
        return $app->sendErrorJSON("Please try again!");
    }
    try {


        $stmt = $app->sqlUpdate("add_income_category", "INCOME_CATEGORY=?", "INCOME_CATEGORY=? AND ENTRY_USER_ID=?", array($category, $category, $app->userSession->getSessionUsername()));

        if ($stmt->rowCount() > 0) {
            $app->sendSuccessJSON("Income category updated successfully!", null);
            $stmt->closeCursor();
            return;
        } else {
            //check if the reason is because the user was not the one who added the record in the first place.
            //to know that we can check if the record exists
            $app->handleUnauthorizedOperation("add_income_category", "INCOME_CATEGORY", "INCOME_CATEGORY =?", array($category));
        }
    } catch (Exception $exc) {
        return $app->sendErrorJSON("Please try again!");
    }
}
