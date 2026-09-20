const express = require("express");

const Equipment = require("../models/Equipment");

const router = express.Router();


// =====================================================
// ADD EQUIPMENT
// POST /api/equipment
// =====================================================

router.post("/", async(req, res) => {
    try {

        const {
            name,
            category,
            description,
            quantity,
            availableQuantity,
            location
        } = req.body;


        // Check required fields
        if (!name ||
            !category ||
            !quantity ||
            availableQuantity === undefined ||
            !location
        ) {
            return res.status(400).json({
                message: "Please fill in all required fields."
            });
        }


        // Create new equipment
        const newEquipment = new Equipment({

            name: name,

            category: category,

            description: description || "",

            quantity: quantity,

            availableQuantity: availableQuantity,

            location: location,

            status: availableQuantity > 0 ?
                "available" :
                "unavailable"
        });


        // Save to MongoDB
        await newEquipment.save();


        res.status(201).json({
            message: "Equipment added successfully.",
            equipment: newEquipment
        });

    } catch (error) {

        console.error(
            "Add equipment error:",
            error
        );

        res.status(500).json({
            message: "Server error. Equipment could not be added."
        });
    }
});


// =====================================================
// GET ALL EQUIPMENT
// GET /api/equipment
// =====================================================

router.get("/", async(req, res) => {
    try {

        const equipment =
            await Equipment.find()
            .sort({ createdAt: -1 });


        res.status(200).json({
            message: "Equipment retrieved successfully.",
            equipment: equipment
        });

    } catch (error) {

        console.error(
            "Get equipment error:",
            error
        );

        res.status(500).json({
            message: "Server error. Could not retrieve equipment."
        });
    }
});


// =====================================================
// GET ONE EQUIPMENT
// GET /api/equipment/:id
// =====================================================

router.get("/:id", async(req, res) => {
    try {

        const equipment =
            await Equipment.findById(
                req.params.id
            );


        if (!equipment) {
            return res.status(404).json({
                message: "Equipment not found."
            });
        }


        res.status(200).json({
            message: "Equipment retrieved successfully.",
            equipment: equipment
        });

    } catch (error) {

        console.error(
            "Get one equipment error:",
            error
        );

        res.status(500).json({
            message: "Server error. Could not retrieve equipment."
        });
    }
});


// =====================================================
// UPDATE EQUIPMENT
// PUT /api/equipment/:id
// =====================================================

router.put("/:id", async(req, res) => {
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


        const updatedEquipment =
            await Equipment.findByIdAndUpdate(
                req.params.id, {
                    name,
                    category,
                    description,
                    quantity,
                    availableQuantity,
                    location,
                    status
                }, {
                    new: true,
                    runValidators: true
                }
            );


        if (!updatedEquipment) {
            return res.status(404).json({
                message: "Equipment not found."
            });
        }


        res.status(200).json({
            message: "Equipment updated successfully.",
            equipment: updatedEquipment
        });

    } catch (error) {

        console.error(
            "Update equipment error:",
            error
        );

        res.status(500).json({
            message: "Server error. Equipment could not be updated."
        });
    }
});


// =====================================================
// DELETE EQUIPMENT
// DELETE /api/equipment/:id
// =====================================================

router.delete("/:id", async(req, res) => {
    try {

        const deletedEquipment =
            await Equipment.findByIdAndDelete(
                req.params.id
            );


        if (!deletedEquipment) {
            return res.status(404).json({
                message: "Equipment not found."
            });
        }


        res.status(200).json({
            message: "Equipment deleted successfully."
        });

    } catch (error) {

        console.error(
            "Delete equipment error:",
            error
        );

        res.status(500).json({
            message: "Server error. Equipment could not be deleted."
        });
    }
});


module.exports = router;