const token =
    localStorage.getItem("token");



// CHECK LOGIN
if (!token) {

    window.location.href =
        "login.html";

}

// LOAD MY BOOKINGS
async function loadMyBookings() {

    try {

        const response =
            await fetch(
                "https://smartlab-production-5fe7.up.railway.app//api/bookings/my-bookings", {
                    headers: {

                        "Authorization": `Bearer ${token}`

                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(data.message);

            return;

        }


        const container =
            document.getElementById(
                "bookingsContainer"
            );


        container.innerHTML = "";



        // No bookings

        if (
            data.bookings.length === 0
        ) {

            container.innerHTML = `

                <div class="no-bookings">

                    <h3>
                        No bookings yet
                    </h3>

                    <p>
                        You haven't made
                        any equipment bookings.
                    </p>

                </div>

            `;

            return;

        }



        // Display bookings

        data.bookings.forEach(
                (booking) => {

                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "booking-card";


                    card.innerHTML = `

                    <h3>
                        ${
                            booking.equipment?.name
                            ||
                            "Equipment unavailable"
                        }
                    </h3>


                    <p>

                        <strong>
                            Category:
                        </strong>

                        ${
                            booking.equipment?.category
                            ||
                            "N/A"
                        }

                    </p>


                    <p>

                        <strong>
                            Location:
                        </strong>

                        ${
                            booking.equipment?.location
                            ||
                            "N/A"
                        }

                    </p>


                    <p>

                        <strong>
                            Date:
                        </strong>

                        ${booking.bookingDate}

                    </p>


                    <p>

                        <strong>
                            Time:
                        </strong>

                        ${booking.startTime}
                        -
                        ${booking.endTime}

                    </p>


                    <p>

                        <strong>
                            Purpose:
                        </strong>

                        ${booking.purpose}

                    </p>


                    <p>

                        <strong>
                            Status:
                        </strong>

                        <span
                            class="status ${booking.status}"
                        >
                            ${booking.status}
                        </span>

                    </p>


                    ${
                        booking.status === "pending"
                        ||
                        booking.status === "approved"

                        ?

                        `

                        <button
                            onclick="
                                cancelBooking(
                                    '${booking._id}'
                                )
                            "
                        >
                            Cancel Booking
                        </button>

                        `

                        :

                        ""

                    }

                `;


                container.appendChild(
                    card
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Load bookings error:",
            error
        );

    }

}



// CANCEL BOOKING

async function cancelBooking(
    bookingId
) {

    const confirmation =
        confirm(
            "Are you sure you want to cancel this booking?"
        );


    if (!confirmation) {

        return;

    }


    try {

        const response =
            await fetch(

                `https://smartlab-production-5fe7.up.railway.app//api/bookings/${bookingId}/cancel`,

                {

                    method: "PUT",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }

            );


        const data =
            await response.json();


        alert(
            data.message
        );


        if (response.ok) {

            loadMyBookings();

        }

    }
    catch (error) {

        console.error(
            "Cancel booking error:",
            error
        );

    }

}

// INITIAL LOAD
loadMyBookings();