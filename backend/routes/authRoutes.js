const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();



// REGISTER


router.post("/register", async(req, res) => {

    try {

        const { name, email, password } = req.body;


        // 1. Check whether all fields are filled
        

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Please fill in all fields."
            });

        }


      
        // 2. Validate name
       

        if (name.trim().length < 2) {

            return res.status(400).json({
                message: "Name must contain at least 2 characters."
            });

        }


       
        // 3. Validate email
        

        const cleanEmail =
            email.trim().toLowerCase();

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(cleanEmail)) {

            return res.status(400).json({
                message: "Please enter a valid email address."
            });

        }


      
        // 4. Validate password
       

        if (password.length < 6) {

            return res.status(400).json({
                message: "Password must contain at least 6 characters."
            });

        }


        
        // 5. Check whether email already exists
     

        const existingUser =
            await User.findOne({
                email: cleanEmail
            });

        if (existingUser) {

            return res.status(400).json({
                message: "An account with this email already exists."
            });

        }


        
        // 6. Hash password
      

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        
        // 7. Create new student user
        

        const newUser =
            new User({

                name: name.trim(),

                email: cleanEmail,

                password: hashedPassword,

                role: "student"

            });


        
        // 8. Save user
    

        await newUser.save();


        
        // 9. Send success response
        

        res.status(201).json({

            message: "Registration successful."

        });

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        res.status(500).json({

            message: "Server error. Registration failed."

        });

    }

});




// LOGIN


router.post("/login", async(req, res) => {

    try {

        const { email, password } =
        req.body;


        
        // 1. Check whether fields are filled
       

        if (!email || !password) {

            return res.status(400).json({

                message: "Please enter email and password."

            });

        }


       
        // 2. Clean email
      

        const cleanEmail =
            email.trim().toLowerCase();


        
        // 3. Validate email format
       

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(cleanEmail)) {

            return res.status(400).json({

                message: "Please enter a valid email address."

            });

        }


      
        // 4. Find user by email
        

        const user =
            await User.findOne({

                email: cleanEmail

            });


        if (!user) {

            return res.status(401).json({

                message: "Invalid email or password."

            });

        }


        
        // 5. Compare password
        

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({

                message: "Invalid email or password."

            });

        }


        
        // 6. Create JWT token
       

        const token =
            jwt.sign(

                {
                    id: user._id,
                    role: user.role
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "1d"
                }

            );


       
        // 7. Send response
      

        res.status(200).json({

            message: "Login successful.",

            token: token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                role: user.role

            }

        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({

            message: "Server error. Login failed."

        });

    }

});


module.exports = router;