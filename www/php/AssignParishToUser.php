<?php

include './base/app-util-base.php';

$app = new AppUtil();

assignParishToUser($app);

function assignParishToUser($app) {


    $parish_sn = $app->getInputPOST('parish_sn');
    $username = $app->getInputPOST('username');

     if ($parish_sn === FALSE) {
      return $app->sendErrorJSON("Please try again!");
      }
      try {


          $stmt = $app->sqlUpdate("register", "PARISH_SN=?", "USERNAME=?", array($parish_sn, $username));

          if ($stmt->rowCount() > 0) {
              $app->sendSuccessJSON("Successfully!", null);
          } else {
              $app->sendErrorJSON("Could not assign parish! Possibly parish already assigned.");
          }
          $stmt->closeCursor();
      } catch (Exception $exc) {
          $app->sendErrorJSON("Please try again later! ".$exc);
      }

}
