
// GET TOKEN
function getToken() {

    return localStorage.getItem(
        "token"
    );

}



// GET USER
function getUser() {

    const user =
        localStorage.getItem(
            "user"
        );


    if (!user) {

        return null;

    }


    try {

        return JSON.parse(user);

    } catch (error) {

        return null;

    }

}


// CHECK LOGIN
function requireLogin() {

    const token =
        getToken();


    const user =
        getUser();


    if (!token || !user) {

        window.location.href =
            "login.html";

        return false;

    }


    return true;

}


// REQUIRE ADMIN
function requireAdmin() {

    if (!requireLogin()) {

        return false;

    }


    const user =
        getUser();


    if (!user ||
        user.role !== "admin"
    ) {

        alert(
            "Access denied. Admin only."
        );


        window.location.href =
            "student-dashboard.html";

        return false;

    }


    return true;

}


// REQUIRE STUDENT
function requireStudent() {

    if (!requireLogin()) {

        return false;

    }


    const user =
        getUser();


    if (!user ||
        user.role !== "student"
    ) {

        alert(
            "Student access only."
        );


        window.location.href =
            "admin-dashboard.html";

        return false;

    }


    return true;

}


// LOGOUT
function logout() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "user"
    );


    window.location.href =
        "login.html";

}