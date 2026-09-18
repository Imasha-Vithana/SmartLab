const bookingForm = document.getElementById("bookingForm");

const checkAvailabilityBtn =
    document.getElementById("checkAvailabilityBtn");

const availabilityMessage =
    document.getElementById("availabilityMessage");


checkAvailabilityBtn.addEventListener(
    "click",
    function() {

        const equipment =
            document.getElementById("equipment").value;

        const date =
            document.getElementById("bookingDate").value;

        const startTime =
            document.getElementById("startTime").value;

        const endTime =
            document.getElementById("endTime").value;


        if (
            equipment === "" ||
            date === "" ||
            startTime === "" ||
            endTime === ""
        ) {

            showMessage(
                "Please fill in all booking details.",
                "unavailable"
            );

            return;
        }


        if (startTime >= endTime) {

            showMessage(
                "End time must be later than start time.",
                "unavailable"
            );

            return;
        }


        /*
         * Temporary availability result.
         *
         * Later this will be connected
         * to our MongoDB database.
         */

        showMessage(
            `${equipment} is available for the selected time.`,
            "available"
        );

    }
);


bookingForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const equipment =
            document.getElementById("equipment").value;

        const date =
            document.getElementById("bookingDate").value;

        const startTime =
            document.getElementById("startTime").value;

        const endTime =
            document.getElementById("endTime").value;

        const purpose =
            document.getElementById("purpose").value;


        if (startTime >= endTime) {

            showMessage(
                "End time must be later than start time.",
                "unavailable"
            );

            return;
        }


        alert(
            `Booking submitted!\n\n` +
            `Equipment: ${equipment}\n` +
            `Date: ${date}\n` +
            `Time: ${startTime} - ${endTime}\n` +
            `Purpose: ${purpose}`
        );

    }
);


function showMessage(message, type) {

    availabilityMessage.textContent = message;

    availabilityMessage.className =
        `availability-message ${type}`;
}