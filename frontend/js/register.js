const registerForm =
    document.getElementById("registerForm");

registerForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const name =
            document.getElementById("name")
            .value
            .trim();

        const email =
            document.getElementById("email")
            .value
            .trim();

        const password =
            document.getElementById("password")
            .value;

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/register", {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(data.message);

                return;
            }

            alert(
                "Registration successful! Please login."
            );

            window.location.href = "login.html";

        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to the server."
            );
        }
    }
);