// 1. CHECK ADMIN ACCESS

if (typeof requireAdmin === "function") {
    if (!requireAdmin()) {
        throw new Error("Unauthorized access. Admin login required.");
    }
}

// Retriveving the tokenfrom localStorage 
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

// 2. LOAD DASHBOARD STATS
async function loadDashboardStats() {
    try {
        const response = await fetch("https://smartlab-production-5fe7.up.railway.app/api/admin/stats", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Failed to load stats");
            return;
        }

        // Checking if an element exists and safely and safely setting Text
        const setStat = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val !== undefined ? val : 0;
        };

        setStat("totalStudents", data.totalStudents);
        setStat("totalEquipment", data.totalEquipment);
        setStat("totalBookings", data.totalBookings);
        setStat("pendingBookings", data.pendingBookings);
        setStat("approvedBookings", data.approvedBookings);
        setStat("rejectedBookings", data.rejectedBookings);
        setStat("cancelledBookings", data.cancelledBookings);

    } catch (error) {
        console.error("Dashboard stats error:", error);
    }
}


// 3. INITIAL LOAD & LOGOUT
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "login.html";
        });
    }

    // Loading stats ahen the page loads
    loadDashboardStats();
});