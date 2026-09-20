const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    equipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Equipment",
        required: true
    },

    bookingDate: {
        type: String,
        required: true
    },

    startTime: {
        type: String,
        required: true
    },

    endTime: {
        type: String,
        required: true
    },

    purpose: {
        type: String,
        required: true,
        trim: true
    },

    status: {
        type: String,
        enum: [
            "pending",
            "approved",
            "rejected",
            "cancelled",
            "returned"
        ],
        default: "pending"
    }
}, {
    timestamps: true
});

module.exports =
    mongoose.model("Booking", bookingSchema);