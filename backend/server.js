const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const equipmentRoutes = require("./routes/equipmentRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminEquipmentRoutes = require("./routes/adminEquipmentRoutes");

const app = express();


// Middleware
app.use(cors());

app.use(express.json());


// Test route
app.get("/", (req, res) => {

    res.send(
        "SmartLab API is running..."
    );

});


// Authentication routes
app.use(
    "/api/auth",
    authRoutes
);


// Equipment routes
app.use(
    "/api/equipment",
    equipmentRoutes
);

//Booking routes
app.use(
    "/api/bookings",
    bookingRoutes
);

//Admin Routes
app.use(
    "/api/admin",
    adminRoutes
);

//Admin Equipment Routes
app.use(
    "/api/admin/equipment",
    adminEquipmentRoutes
);
//Equipment Routes
app.use(
    "/api/equipment",
    equipmentRoutes
);

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)

.then(() => {

    console.log(
        "MongoDB connected successfully."
    );


    const PORT =
        process.env.PORT || 5000;


    app.listen(
        PORT,
        () => {

            console.log(
                `Server running on port ${PORT}`
            );

        }
    );

})

.catch((error) => {

    console.error(
        "MongoDB connection failed:"
    );

    console.error(
        error.message
    );

});