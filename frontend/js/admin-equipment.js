const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

// Token na thakle ba Admin role na thakle login-e pathai dibe
if (!token || role !== "admin") {
    alert("Unauthorized access! Admin login required.");
    window.location.href = "login.html";
}

// =====================================================
// LOAD EQUIPMENT
// =====================================================
async function loadEquipment() {
    try {
        const response = await fetch("http://localhost:5000/api/admin/equipment", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Failed to fetch equipment");
            return;
        }

        const container = document.getElementById("equipmentContainer");
        if (!container) return;

        container.innerHTML = "";

        if (!data.equipment || data.equipment.length === 0) {
            container.innerHTML = "<p>No equipment found.</p>";
            return;
        }

        data.equipment.forEach((equipment) => {
                    const card = document.createElement("div");
                    card.className = "equipment-card";

                    card.innerHTML = `
                <h3>${equipment.name}</h3>
                <p><strong>Category:</strong> ${equipment.category}</p>
                <p><strong>Quantity:</strong> ${equipment.quantity}</p>
                <p><strong>Location:</strong> ${equipment.location}</p>
                <p><strong>Status:</strong> <span class="badge ${equipment.status}">${equipment.status}</span></p>
                ${equipment.description ? `<p><strong>Description:</strong> ${equipment.description}</p>` : ''}
                <button 
                    class="btn btn-danger" 
                    onclick="deleteEquipment('${equipment._id}')"
                >
                    Delete
                </button>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Equipment loading error:", error);
    }
}

// =====================================================
// ADD EQUIPMENT & EVENT LISTENERS
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
    loadEquipment();

    // Logout logic
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "login.html";
        });
    }

    const form = document.getElementById("equipmentForm");

    if (form) {
        form.addEventListener("submit", async function(event) {
            event.preventDefault();

            const equipmentData = {
                name: document.getElementById("name").value,
                category: document.getElementById("category").value,
                description: document.getElementById("description").value,
                quantity: document.getElementById("quantity").value,
                location: document.getElementById("location").value,
                status: document.getElementById("status").value
            };

            try {
                const response = await fetch("http://localhost:5000/api/admin/equipment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(equipmentData)
                });

                const data = await response.json();
                alert(data.message);

                if (response.ok) {
                    form.reset();
                    document.getElementById("status").value = "available";
                    loadEquipment();
                }

            } catch (error) {
                console.error("Add equipment error:", error);
                alert("Unable to connect to server.");
            }
        });
    }
});

// =====================================================
// DELETE EQUIPMENT
// =====================================================
async function deleteEquipment(equipmentId) {
    const confirmDelete = confirm("Are you sure you want to delete this equipment?");

    if (!confirmDelete) return;

    try {
        const response = await fetch(`http://localhost:5000/api/admin/equipment/${equipmentId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        alert(data.message);

        if (response.ok) {
            loadEquipment();
        }

    } catch (error) {
        console.error("Delete equipment error:", error);
    }
}