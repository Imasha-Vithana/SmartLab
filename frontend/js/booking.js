document.addEventListener("DOMContentLoaded", function() {
    loadEquipmentOptions();
    setupFormSubmit();
    setupAvailabilityCheck();
});

// 1. Load Equipment Options
async function loadEquipmentOptions() {
    const equipmentSelect = document.getElementById("equipment");
    if (!equipmentSelect) return;

    try {
        const response = await fetch("http://localhost:5000/api/equipment");
        const data = await response.json();

        if (response.ok) {
            const list = Array.isArray(data) ? data : (data.equipment || []);
            equipmentSelect.innerHTML = '<option value="">Select Equipment</option>';

            if (list.length === 0) {
                console.warn("Database එකේ Equipment කිසිවක් හමු වූයේ නැත.");
                return;
            }

            list.forEach(item => {
                const option = document.createElement("option");
                option.value = item._id || item.id;
                option.textContent = item.name ? `${item.name} (${item.category || ''})` : (item.title || item.equipmentName);
                equipmentSelect.appendChild(option);
            });
        } else {
            console.error("Equipment load කිරීමට නොහැකි විය:", data.message);
        }
    } catch (error) {
        console.error("Error fetching equipment:", error);
    }
}

// 2. Submit Booking Form
function setupFormSubmit() {
    const bookingForm = document.getElementById("bookingForm");
    if (!bookingForm) return;

    bookingForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please First Login!");
            window.location.href = "login.html";
            return;
        }

        const bookingData = {
            equipment: document.getElementById("equipment").value,
            bookingDate: document.getElementById("bookingDate").value,
            startTime: document.getElementById("startTime").value,
            endTime: document.getElementById("endTime").value,
            purpose: document.getElementById("purpose").value
        };

        try {
            const res = await fetch("http://localhost:5000/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });

            const result = await res.json();

            if (res.ok) {
                alert("Booking Successfully Entered!");
                window.location.href = "my-bookings.html";
            } else {
                alert(result.message || "Booking Failed.");
            }
        } catch (err) {
            console.error("Booking submit error:", err);
            alert("Unable to connect to Server.");
        }
    });
}

// 3. Check Availability (Backend Route එකට සහ Query parameters වලට නිවැරදිව සකසා ඇත)
function setupAvailabilityCheck() {
    const checkBtn = document.getElementById("checkAvailabilityBtn");
    const msgPara = document.getElementById("availabilityMessage");

    if (!checkBtn || !msgPara) return;

    checkBtn.addEventListener("click", async function() {
        const token = localStorage.getItem("token");
        if (!token) {
            msgPara.style.color = "red";
            msgPara.textContent = "Please Login First!";
            return;
        }

        const equipment = document.getElementById("equipment").value;
        const bookingDate = document.getElementById("bookingDate").value;
        const startTime = document.getElementById("startTime").value;
        const endTime = document.getElementById("endTime").value;

        if (!equipment || !bookingDate || !startTime || !endTime) {
            msgPara.style.color = "red";
            msgPara.textContent = "Please Select Equipment, Date & Time!";
            return;
        }

        try {
            // URL එක backend route එකට ගැලපෙන සේ /availability ලෙස සකසා ඇත
            const url = `http://localhost:5000/api/bookings/availability?equipment=${equipment}&bookingDate=${bookingDate}&startTime=${startTime}&endTime=${endTime}`;

            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (res.ok && data.available) {
                msgPara.style.color = "green";
                msgPara.textContent = `Available! (${data.availableUnits} units available)`;
            } else {
                msgPara.style.color = "red";
                msgPara.textContent = data.message || "This time slot is already booked.";
            }
        } catch (err) {
            console.error("Availability check error:", err);
            msgPara.style.color = "red";
            msgPara.textContent = "Unable to check availability.";
        }
    });
}