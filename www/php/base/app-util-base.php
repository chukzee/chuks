<?php

session_start();//come back

include 'app-config.php';

class AppUtil {

    public $conn = null;
    public $userSession = null;
    
    public function __construct() {

        $this->userSession = new UserBasicSession();
        $config = new Config;       
        $this->conn = new PDO("mysql:host=$config->db_host;dbname=".$config->db_name, $config->db_username, $config->db_password);
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    
    public function handleUnauthorizedOperation($table, $columns, $condition_expressions, $params_array) {
        //check if the reason is because the user was not the one who added the record in the first place.
        //to know that we can check if the record exists
        $stmt = $this->sqlSelect($table, $columns, $condition_expressions, $params_array);

        if ($stmt->rowCount() > 0) {
            //ok the bank exist so the user can not update a bank he did not add in the first place
            $this->sendUnauthorizedOperationJSON("You cannot update a record that does not originate from you!");
            $stmt->closeCursor();
            return;
        } else {
            return $this->sendErrorJSON("Please try again later!");
        }
    }

    public function sendErrorJSON($errMsg) {
        $f = new Feedback($errMsg);
        $f->status = "error";
        echo json_encode($f);
    }

    public function sendSessionNotAvaliableJSON($errMsg) {
        if ($errMsg == null || $errMsg == '') {
            $errMsg = "Your session is no longer available!";
        }
        $f = new Feedback($errMsg);
        $f->status = "session_not_available";
        echo json_encode($f);
    }

    public function sendIgnoreJSON($msg) {
        if ($msg == null || $msg == '') {
            $msg = "Operation was ignored";
        }
        $f = new Feedback($msg);
        $f->status = "ignore";
        echo json_encode($f);
    }

    public function sendUnauthorizedOperationJSON($msg) {
        if ($msg == null || $msg == '') {
            $msg = "Unauthorized operation!";
        }
        $f = new Feedback($msg);
        $f->status = "unauthorized_operation";
        echo json_encode($f);
    }

    public function sendSuccessJSON($msg, $data) {
        if ($msg == null || $msg == '') {
            $msg = "Operation was successful";
        }
        $f = new Feedback($msg);
        $f->status = "success";
        $f->data = $data;
        echo json_encode($f);
    }

    public function getInputGET($name) {
        $filter = filter_input(INPUT_GET, $name);
        if ($filter === FALSE) {
            return $filter;
        }
        return trim($filter);
    }

    public function getInputPOST($name) {
        $filter = filter_input(INPUT_POST, $name);
        if ($filter === FALSE) {
            return $filter;
        }
        return trim($filter);
    }

    public function sqlSelect($table, $columns_seperated_by_comma, $condition_expression, $params_array) {

        $where_clause = $condition_expression;

        if ($condition_expression != null && $condition_expression != '') {
            $where_clause = " WHERE " . $condition_expression;
        }

        $stmt = $this->conn->prepare("SELECT " . $columns_seperated_by_comma
                . " FROM "
                . $table
                . $where_clause);

        $stmt->execute($params_array);

        return $stmt;
    }

    public function sqlInsert($table, $columns_seperated_by_comma, $values_seperated_by_comma, $params_array) {

        $columns = '';

        if ($columns_seperated_by_comma != null && $columns_seperated_by_comma != '') {
            $columns = " ( " . $columns_seperated_by_comma . " ) ";
        }

        $values = " VALUES ( " . $values_seperated_by_comma . " ) ";

        $stmt = $this->conn->prepare("INSERT INTO " . $table . $columns . $values);

        $stmt->execute($params_array);

        return $stmt;
    }

    public function sqlUpdate($table, $set_clause, $condition_expression, $params_array) {

        $where_clause = $condition_expression;

        if ($condition_expression != null && $condition_expression != '') {
            $where_clause = " WHERE " . $condition_expression;
        }
 
        $stmt = $this->conn->prepare("UPDATE " . $table
                . " SET "
                . $set_clause
                . $where_clause);

        $stmt->execute($params_array);

        return $stmt;
    }

    public function sqlDelete($table, $condition_expression, $params_array) {

        $where_clause = $condition_expression;

        if ($condition_expression != null && $condition_expression != '') {
            $where_clause = " WHERE " . $condition_expression;
        }

        $stmt = $this->conn->prepare("DELETE FROM " . $table
                . $where_clause);

        $stmt->execute($params_array);

        return $stmt;
    }
    
    public function createDBTableView($stmt){
        if(!($stmt instanceof PDOStatement)){// is this really necessary
            throw InvalidArgumentException("Expected PDOStatement object");
        }
        $table = null;
        $isAllColumnsKnown = false;
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row_data = array();
            $columns = array();
            $index = -1;
            while (($field = current($row)) !== FALSE) {
                $index++;
                if (!$isAllColumnsKnown) {
                    $columns[$index] = key($row); //get the column name
                }
                $row_data[$index] = $field;
                next($row); //advance to the next element of the array
            }

            if ($table == null) {
                $table = new TableView($columns);
                $isAllColumnsKnown = true;
            }

            $table->addRowData($row_data);
        }
        
        if($table==null){
            $table = new TableView(array()); //empty table view
        }
        
        return $table;
    }

}

class Feedback {

    public $status = "";
    public $msg = "";
    public $data = null; //could be any object

    public function __construct($msg) {
        $this->msg = $msg;
    }

}

class UserBasicSession {

    public function __construct() {
    
    }

    public function set($name, $value) {
        $_SESSION[$name] = $value;
        session_write_close(); //important! avoid blocking other scripts that need the session file which is locked by php when writing session variables . 
    }

    public function get($name) {
        if (isset($_SESSION[$name])) {
            return $_SESSION[$name];
        }
    }

    public function isBasicSessionAvailable() {
        return isset($_SESSION["username"])
        && isset($_SESSION["hash_password"]) && 
        isset($_SESSION["user_group"]) &&
        isset($_SESSION["user_role"]) &&
        isset($_SESSION["user_parish_id"]);
    }

    public function setSessionUserParishID($value) {
         $_SESSION["user_parish_id"] = $value;
        session_write_close(); //important! avoid blocking other scripts that need the session file which is locked by php when writing session variables . 
    }

    public function setSessionUserGroup($value) {
         $_SESSION["user_group"] = $value;
        session_write_close(); //important! avoid blocking other scripts that need the session file which is locked by php when writing session variables . 
    }

    public function setSessionUsername($value) {
         $_SESSION["username"] = $value;
        session_write_close(); //important! avoid blocking other scripts that need the session file which is locked by php when writing session variables . 
    }

    public function setSessionHashPassword($value) {
         $_SESSION["hash_password"] = $value;
        session_write_close(); //important! avoid blocking other scripts that need the session file which is locked by php when writing session variables . 
    }

    public function setSessionUserRole($value) {
         $_SESSION["user_role"] = $value;
        session_write_close(); //important! avoid blocking other scripts that need the session file which is locked by php when writing session variables . 
    }
    
    public function getSessionUsername() {
        return $_SESSION["username"];
    }

    public function getSessionHashPassword() {
        return $_SESSION["hash_password"];
    }

    public function getSessionUserGroup() {
        return $_SESSION["user_group"];
    }

    public function getSessionUserRole() {
        return $_SESSION["user_role"];
    }

    public function getSessionUserParishID() {
        return $_SESSION["user_parish_id"];
    }

}

class TableView {

    public $table_columns; //array of column names
    public $table_data = array();
    public $row_count =0;
    public $column_count =0;
    public $table_title = "";

    public function __construct($colum_arr) {
        if (is_array($colum_arr)) {
            $this->table_columns = $colum_arr;
            $this->column_count = count($colum_arr);
        } else {
            throw new InvalidArgumentException("Expected array type!");
        }
    }

    public function setTitle($title) {
        if (!is_string($title)) {          
            throw new InvalidArgumentException("Expected string type!");
        }
        $this->table_title = $title;
    }
    
    public function addRowData($row_data_arr) {
        if (is_array($row_data_arr)) {
            if(count($row_data_arr) != $this->column_count){
                throw new InvalidArgumentException("length of row data must be equal to number of columns! Expecte length of ".$this->column_count);
            }
            $this->row_count++;
            $this->table_data[$this->row_count - 1] = $row_data_arr;
        } else {
            throw new InvalidArgumentException("Expected array type!");
        }
    }

}

class User {

    public $firstName;
    public $lastName;
    public $middleName;
    public $dob;
    public $birthday;
    public $ageRange;
    public $sex;
    public $address;
    public $email;
    public $verifiedEmail;
    public $phoneNumbers;
    public $dateConverted;
    public $membershipDate;
    public $photoUrl;
    public $designation;
    public $dept;
    public $group;
    public $role;
    public $uneditableFeatures;
    public $unviewableFeatures;
    public $parishAddress;
    public $parishName;
    public $parishLogitutude;
    public $parishLatitude;
    public $area;
    public $zone;
    public $province;
    public $region;
    public $national;

    public function __construct() {
        
    }

}
