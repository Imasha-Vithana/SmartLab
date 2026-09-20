const express = require("express");

const User = require("../models/User");
const Equipment = require("../models/Equipment");
const Booking = require("../models/Booking");

// Middlewares වෙන වෙනම File වලින් Import කිරීම
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// GET ADMIN DASHBOARD STATISTICS
router.get(
    "/stats",
    protect,
    admin,
    async(req, res) => {
        try {
            const totalStudents = await User.countDocuments({ role: "student" });
            const totalEquipment = await Equipment.countDocuments();
            const totalBookings = await Booking.countDocuments();
            const pendingBookings = await Booking.countDocuments({ status: "pending" });
            const approvedBookings = await Booking.countDocuments({ status: "approved" });
            const rejectedBookings = await Booking.countDocuments({ status: "rejected" });
            const cancelledBookings = await Booking.countDocuments({ status: "cancelled" });

            res.status(200).json({
                totalStudents,
                totalEquipment,
                totalBookings,
                pendingBookings,
                approvedBookings,
                rejectedBookings,
                cancelledBookings
            });

        } catch (error) {
            console.error("Dashboard statistics error:", error);
            res.status(500).json({
                message: "Could not load dashboard statistics."
            });
        }
    }
);

module.exports = router;