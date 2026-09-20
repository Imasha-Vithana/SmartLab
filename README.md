# SmartLab - Laboratory Equipment Booking System

SmartLab is a web-based laboratory equipment booking system
developed to make laboratory equipment reservations easier,
more organized, and efficient.

## Features

- Student registration and login
- JWT-based authentication
- Laboratory equipment browsing
- Equipment availability checking
- Equipment booking
- Booking cancellation
- My Bookings
- Admin authentication
- Equipment management
- Booking management
- Dashboard statistics
- Input validation
- Secure password hashing

## User Roles

### Student

Students can:

- Create an account
- Login
- View laboratory equipment
- Check equipment availability
- Book equipment
- View their bookings
- Cancel their bookings

### Admin

Administrators can:

- Login to the admin system
- Manage laboratory equipment
- View bookings
- Manage booking status
- View system statistics

## Technologies

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Node.js
- Express.js
- JWT
- bcryptjs

### Database

- MongoDB
- Mongoose

## Authentication

SmartLab uses JWT-based authentication.

Passwords are securely hashed using bcryptjs.

Protected API routes require a valid JWT token.

## Booking System

The system checks:

- Equipment availability
- Booking date
- Start time
- End time
- Existing overlapping bookings
- Equipment quantity

This helps prevent conflicting bookings.

## Project Structure

```text
SmartLab/
│
├── frontend/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── .env
│
├── .gitignore
└── README.md