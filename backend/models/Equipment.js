const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: "",
        trim: true
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },

    availableQuantity: {
        type: Number,
        required: true,
        min: 0
    },

    location: {
        type: String,
        required: true,
        trim: true
    },

    status: {
        type: String,
        enum: ["available", "unavailable"],
        default: "available"
    }
}, {
    timestamps: true
});

module.exports =
    mongoose.model("Equipment", equipmentSchema);