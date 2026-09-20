const express = require("express");
const Booking = require("../models/Booking");
const Equipment = require("../models/Equipment");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


// CHECK AVAILABILITY
// GET /api/bookings/availability OR /api/bookings/check-availability

const checkAvailabilityHandler = async(req, res) => {
    try {
        const equipment = req.query.equipment;
        const bookingDate = req.query.bookingDate || req.query.date;
        const startTime = req.query.startTime;
        const endTime = req.query.endTime;

        if (!equipment || !bookingDate || !startTime || !endTime) {
            return res.status(400).json({
                message: "Equipment, date, start time and end time are required."
            });
        }

        if (startTime >= endTime) {
            return res.status(400).json({
                message: "End time must be after start time."
            });
        }

        const selectedEquipment = await Equipment.findById(equipment);

        if (!selectedEquipment) {
            return res.status(404).json({
                message: "Equipment not found."
            });
        }

        const overlappingBookings = await Booking.find({
            equipment: equipment,
            bookingDate: bookingDate,
            status: { $in: ["pending", "approved"] },
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
        });

        const totalQuantity = selectedEquipment.quantity;
        const bookedUnits = overlappingBookings.length;
        const availableUnits = totalQuantity - bookedUnits;

        res.status(200).json({
            equipment: {
                id: selectedEquipment._id,
                name: selectedEquipment.name
            },
            bookingDate: bookingDate,
            startTime: startTime,
            endTime: endTime,
            totalQuantity: totalQuantity,
            bookedUnits: bookedUnits,
            availableUnits: Math.max(availableUnits, 0),
            available: availableUnits > 0
        });

    } catch (error) {
        console.error("Availability check error:", error);
        res.status(500).json({
            message: "Server error. Could not check availability."
        });
    }
};

router.get("/availability", protect, checkAvailabilityHandler);
router.get("/check-availability", protect, checkAvailabilityHandler);


// GET MY BOOKINGS
// GET /api/bookings/my OR /api/bookings/my-bookings

const getMyBookingsHandler = async(req, res) => {
    try {
        const userId = req.user ? (req.user._id || req.user.id) : req.user;

        const bookings = await Booking.find({ user: userId })
            .populate("equipment", "name category location quantity")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Bookings retrieved successfully.",
            bookings: bookings
        });

    } catch (error) {
        console.error("Get my bookings error:", error);
        res.status(500).json({
            message: "Server error. Could not retrieve bookings."
        });
    }
};

router.get("/my", protect, getMyBookingsHandler);
router.get("/my-bookings", protect, getMyBookingsHandler);


// CREATE BOOKING
// POST /api/bookings

router.post("/", protect, async(req, res) => {
    try {
        const { equipment, bookingDate, startTime, endTime, purpose } = req.body;

        if (!equipment || !bookingDate || !startTime || !endTime || !purpose) {
            return res.status(400).json({
                message: "Please fill in all booking fields."
            });
        }

        if (startTime >= endTime) {
            return res.status(400).json({
                message: "End time must be after start time."
            });
        }

        const selectedEquipment = await Equipment.findById(equipment);

        if (!selectedEquipment) {
            return res.status(404).json({
                message: "Equipment not found."
            });
        }

        const overlappingBookings = await Booking.find({
            equipment: equipment,
            bookingDate: bookingDate,
            status: { $in: ["pending", "approved"] },
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
        });

        const bookedUnits = overlappingBookings.length;

        if (bookedUnits >= selectedEquipment.quantity) {
            return res.status(409).json({
                message: "This equipment is not available for the selected time slot.",
                availableUnits: 0
            });
        }

        const userId = req.user ? (req.user._id || req.user.id) : req.user;

        const newBooking = new Booking({
            user: userId,
            equipment: equipment,
            bookingDate: bookingDate,
            startTime: startTime,
            endTime: endTime,
            purpose: purpose,
            status: "pending"
        });

        await newBooking.save();

        res.status(201).json({
            message: "Booking created successfully.",
            booking: newBooking,
            remainingUnits: selectedEquipment.quantity - bookedUnits - 1
        });

    } catch (error) {
        console.error("Create booking error:", error);
        res.status(500).json({
            message: "Server error. Booking could not be created."
        });
    }
});


// CANCEL BOOKING
// PUT /api/bookings/:id/cancel

router.put("/:id/cancel", protect, async(req, res) => {
    try {
        const userId = req.user ? (req.user._id || req.user.id) : req.user;

        const booking = await Booking.findOne({
            _id: req.params.id,
            user: userId
        });

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found."
            });
        }

        if (booking.status !== "pending" && booking.status !== "approved") {
            return res.status(400).json({
                message: "This booking cannot be cancelled."
            });
        }

        booking.status = "cancelled";
        await booking.save();

        res.status(200).json({
            message: "Booking cancelled successfully.",
            booking: booking
        });

    } catch (error) {
        console.error("Cancel booking error:", error);
        res.status(500).json({
            message: "Server error. Booking could not be cancelled."
        });
    }
});


// GET ONE BOOKING (Must be at the BOTTOM)
// GET /api/bookings/:id

router.get("/:id", protect, async(req, res) => {
    try {
        const userId = req.user ? (req.user._id || req.user.id) : req.user;

        const booking = await Booking.findOne({
            _id: req.params.id,
            user: userId
        }).populate("equipment", "name category location quantity");

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found."
            });
        }

        res.status(200).json({
            message: "Booking retrieved successfully.",
            booking: booking
        });

    } catch (error) {
        console.error("Get booking error:", error);
        res.status(500).json({
            message: "Server error. Could not retrieve booking."
        });
    }
});

module.exports = router;