const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this
const app = express();
const port = 3002;

// Middleware
app.use(cors()); // Add this to handle CORS issues
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const uri = "mongodb+srv://abhinav:mongodb@cluster0.ts5pz.mongodb.net/bus";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

// Define Customer Schema
const customerSchema = new mongoose.Schema({
    departure: String,
    destination: String,
    date: String,
    passengerName: String,
    time: String,
    seats: Number
});

const Customer = mongoose.model('Customer', customerSchema);

// POST route to store booking data
app.post('/book-bus', async (req, res) => {
    try {
        console.log('Received booking data:', req.body);

        const { departure, destination, date, passengerName, time, seats } = req.body;

        // Validate the data
        if (!departure || !destination || !date || !passengerName || !time || !seats) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Create new customer booking
        const newCustomer = new Customer({
            departure,
            destination,
            date,
            passengerName,
            time,
            seats
        });

        // Save to MongoDB
        await newCustomer.save();
        res.status(200).json({ message: 'Booking successful!' });
    } catch (error) {
        console.error('Error in booking:', error);
        res.status(500).json({ error: 'Error booking bus: ' + error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});