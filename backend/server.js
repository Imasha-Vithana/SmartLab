const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotnev = require("dotenv");
require("dotenv").config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Test Route
app.get("/", (req, res) => {
    res.send("SmartLab API is running...");
});


// MongoDB Connection
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
        family: 4,
        serverSelectionTimeoutMS: 5000
    })
    .then(() => {
        console.log("MongoDB connected successfully.");
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:");
        console.error(error.message);
    });