<?php
    session_start();
    // get our config values and create a db connection
    $addUserSql = get_cfg_var("myapp.addUser.sql");
    $selectUserSql = get_cfg_var("myapp.selectUser.sql");
    $conn = mysqli_connect(
        get_cfg_var("myapp.cfg.db.servername"),
        get_cfg_var("myapp.cfg.db.username"),
        get_cfg_var("myapp.cfg.db.password"),
        get_cfg_var("myapp.cfg.db.database"));

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }
    $errors = array();

    if (isset($_POST['firstName'])) {
        // prepare our sql statement
        $addUserStmt = mysqli_prepare($conn, $addUserSql);
        // bind our data parameters
        mysqli_stmt_bind_param(
            $addUserStmt,
            'sssisssss',
            $firstName,
            $lastName,
            $email,
            $mobile,
            $gender,
            $city,
            $state,
            $qualification,
            $password);
        // parse the data from our post request
        $firstName = mysqli_real_escape_string($conn, $_POST['firstName']);
        $lastName = mysqli_real_escape_string($conn, $_POST['lastName']);
        $email = mysqli_real_escape_string($conn, $_POST['email']);
        $mobile = $_POST['mobile'];
        $gender = mysqli_real_escape_string($conn, $_POST['gender']);
        $city = mysqli_real_escape_string($conn, $_POST['city']);
        $state = mysqli_real_escape_string($conn, $_POST['state']);
        $qualification = mysqli_real_escape_string($conn, $_POST['qualification']);
        $password = mysqli_real_escape_string($conn, $_POST['password']);
        // check to make sure no fields are empty
        if (empty($firstName)) { array_push($errors, "First name is required"); }
        if (empty($lastName)) { array_push($errors, "Last name is required"); }
        if (empty($email)) { array_push($errors, "Email is required"); }
        if (empty($password)) { array_push($errors, "Password is required"); }
        if (empty($gender)) { array_push($errors, "Gender is required"); }
        if (empty($city)) { array_push($errors, "City is required"); }
        if (empty($state)) { array_push($errors, "State is required"); }
        if (empty($qualification)) { array_push($errors, "Qualification is required"); }
        // check formatting of firstName, lastName, email, and password
        if (!preg_match("/^[a-zA-Z'\s]{1,30}$/", $firstName)) { array_push($errors, "First name is not in the correct format"); }
        if (!preg_match("/^[a-zA-Z'\s]{1,30}$/", $lastName)) { array_push($errors, "Last name is not in the correct format"); }
        if (!preg_match("/^[a-z0-9\-_\.']+@(?:\w|\d)+(\.(?:\w|\d)+)?$/", $email)) { array_push($errors, "Email is not in the correct format"); }
        if (!preg_match("/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])^[a-zA-Z0-9'\s]{3,}$/", $password)) { array_push($errors, "Password is not in the correct format"); }

        // check if a user exists with the supplied email.
        $userExistsQuery = sprintf($selectUserSql, $email);
        $result = mysqli_query($conn, $userExistsQuery);
        $user = mysqli_fetch_assoc($result);
        if ($user) { array_push($errors, "User with email already exists."); }

        // if there are no errors, encrypt the password, save to the database, and return a success message
        if (count($errors) == 0) {
            $password = password_hash($password, PASSWORD_BCRYPT);
            mysqli_stmt_execute($addUserStmt);
            echo json_encode("Success");
        } else { // otherwise return the errors we found with the data
            echo json_encode($errors);
        }
    }
?>
