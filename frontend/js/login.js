// ==========================================
// SMARTLAB LOGIN
// ==========================================

const loginForm =
    document.getElementById("loginForm");


loginForm.addEventListener(
    "submit",
    async function(event) {

        // Stop normal form submission
        event.preventDefault();


        // ======================================
        // Get input values
        // ======================================

        const email =
            document.getElementById("email")
            .value
            .trim();

        const password =
            document.getElementById("password")
            .value;


        // ======================================
        // Check fields
        // ======================================

        if (!email || !password) {

            alert(
                "Please enter your email and password."
            );

            return;
        }


        try {

            // ==================================
            // Send login request to backend
            // ==================================

            const response = await fetch(
                "http://localhost:5000/api/auth/login", {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            // Convert response to JSON
            const data = await response.json();


            // ==================================
            // Check response
            // ==================================

            if (!response.ok) {

                alert(data.message);

                return;
            }


            // ==================================
            // Login successful
            // ==================================

            // Save JWT token
            localStorage.setItem(
                "token",
                data.token
            );


            // Save user information
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            // Show success message
            alert(
                "Login successful!"
            );


            // ==================================
            // Redirect based on user role
            // ==================================

            if (data.user.role === "admin") {

                window.location.href =
                    "admin-dashboard.html";

            } else {

                window.location.href =
                    "equipment.html";
            }

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            alert(
                "Unable to connect to the server."
            );
        }
    }
);