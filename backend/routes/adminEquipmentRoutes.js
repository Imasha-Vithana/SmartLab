const express = require("express");
const Equipment = require("../models/Equipment");
const Booking = require("../models/Booking");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// =====================================================
// GET ALL EQUIPMENT
// GET /api/admin/equipment
// =====================================================
router.get(
    "/",
    protect,
    admin,
    async(req, res) => {
        try {
            const equipment = await Equipment.find().sort({ createdAt: -1 });

            res.status(200).json({
                message: "Equipment retrieved successfully.",
                equipment: equipment
            });
        } catch (error) {
            console.error("Get equipment error:", error);
            res.status(500).json({
                message: "Could not retrieve equipment."
            });
        }
    }
);

// =====================================================
// ADD EQUIPMENT
// POST /api/admin/equipment
// =====================================================
router.post(
    "/",
    protect,
    admin,
    async(req, res) => {
        try {
            const {
                name,
                category,
                description,
                quantity,
                availableQuantity, // 🔴 req.body එකෙන් ලබා ගැනීම
                location,
                status
            } = req.body;

            // -----------------------------------------
            // Validation
            // -----------------------------------------
            if (!name || !category || !quantity || !location) {
                return res.status(400).json({
                    message: "Name, category, quantity and location are required."
                });
            }

            if (quantity < 1) {
                return res.status(400).json({
                    message: "Quantity must be at least 1."
                });
            }

            // -----------------------------------------
            // Create equipment
            // -----------------------------------------
            const numQuantity = Number(quantity);
            // availableQuantity එක එව්වේ නැත්නම් quantity අගයම ගන්නවා
            const numAvailableQuantity = availableQuantity !== undefined ? Number(availableQuantity) : numQuantity;

            const newEquipment = new Equipment({
                name: name.trim(),
                category: category.trim(),
                description: description ? description.trim() : "",
                quantity: numQuantity,
                availableQuantity: numAvailableQuantity, // 🔴 මෙන්න මේ missing field එක එකතු කළා
                location: location.trim(),
                status: status || "available"
            });

            await newEquipment.save();

            res.status(201).json({
                message: "Equipment added successfully.",
                equipment: newEquipment
            });

        } catch (error) {
            console.error("Add equipment error:", error);
            res.status(500).json({
                message: "Equipment could not be added.",
                error: error.message
            });
        }
    }
);

// =====================================================
// UPDATE EQUIPMENT
// PUT /api/admin/equipment/:id
// =====================================================
router.put(
    "/:id",
    protect,
    admin,
    async(req, res) => {
        try {
            const {
                name,
                category,
                description,
                quantity,
                availableQuantity,
                location,
                status
            } = req.body;

            const equipment = await Equipment.findById(req.params.id);

            if (!equipment) {
                return res.status(404).json({
                    message: "Equipment not found."
                });
            }

            // -----------------------------------------
            // Update fields
            // -----------------------------------------
            if (name !== undefined) equipment.name = name.trim();
            if (category !== undefined) equipment.category = category.trim();
            if (description !== undefined) equipment.description = description.trim();

            if (quantity !== undefined) {
                if (Number(quantity) < 1) {
                    return res.status(400).json({
                        message: "Quantity must be at least 1."
                    });
                }
                equipment.quantity = Number(quantity);
            }

            if (availableQuantity !== undefined) {
                equipment.availableQuantity = Number(availableQuantity);
            }

            if (location !== undefined) equipment.location = location.trim();

            if (status !== undefined) {
                const validStatuses = ["available", "unavailable", "maintenance"];
                if (!validStatuses.includes(status)) {
                    return res.status(400).json({
                        message: "Invalid equipment status."
                    });
                }
                equipment.status = status;
            }

            await equipment.save();

            res.status(200).json({
                message: "Equipment updated successfully.",
                equipment: equipment
            });

        } catch (error) {
            console.error("Update equipment error:", error);
            res.status(500).json({
                message: "Equipment could not be updated."
            });
        }
    }
);

// =====================================================
// DELETE EQUIPMENT
// DELETE /api/admin/equipment/:id
// =====================================================
router.delete(
    "/:id",
    protect,
    admin,
    async(req, res) => {
        try {
            const equipment = await Equipment.findById(req.params.id);

            if (!equipment) {
                return res.status(404).json({
                    message: "Equipment not found."
                });
            }

            const activeBookings =
                await Booking.countDocuments({
                    equipment: req.params.id,

                    status: {
                        $in: [
                            "pending",
                            "approved"
                        ]
                    }
                });


            if (activeBookings > 0) {

                return res.status(400).json({

                    message: "Cannot delete equipment with active bookings."
                });
            }

            await Equipment.findByIdAndDelete(req.params.id);

            res.status(200).json({
                message: "Equipment deleted successfully."
            });

        } catch (error) {
            console.error("Delete equipment error:", error);
            res.status(500).json({
                message: "Equipment could not be deleted."
            });
        }
    }
);

module.exports = router;