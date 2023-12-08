const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// to data store for rooms and bookings
const rooms = [];
const bookings = [];

// ************************************************** Rooms API **************************************************
// 1. to create a new room
app.post("/rooms", (req, res) => {
  // get room details from the request body
  const { name, seats, amenities, price_per_hour } = req.body;

  // create a room object
  const room = { id: rooms.length + 1, name, seats, amenities, price_per_hour };

  // adding the room to the data store
  rooms.push(room);

  // sending the created room
  res.status(201).json(room);
});

// ************************************************** Bookings API **************************************************
// 2. to book a room
app.post("/bookings", (req, res) => {
  // getting booking details from the request body
  const { customer_name, date, start_time, end_time, room_id } = req.body;

  // finding the room with the provided room_id
  const room = rooms.find((r) => r.id === room_id);

  // if the room does not exist we return a 404 error
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  // creating a booking object
  const booking = {
    id: bookings.length + 1,
    customer_name,
    date,
    start_time,
    end_time,
    room_id,
  };

  // once the bookig is done we add the booking to data store
  bookings.push(booking);

  // sending the created booking
  res.status(201).json(booking);
});

// ************************************************** Data API **************************************************

// 3. showing all rooms with booked data
app.get("/data/rooms/bookings", (req, res) => {
  const roomBookings = bookings.map((booking) => ({
    room_name: rooms.find((r) => r.id === booking.room_id).name,
    booked_status: true,
    customer_name: booking.customer_name,
    date: booking.date,
    start_time: booking.start_time,
    end_time: booking.end_time,
  }));

  // sending the list of room bookings
  res.status(200).json(roomBookings);
});

// 4. showing all customers with booked data
app.get("/data/customers/bookings", (req, res) => {
  const customerBookings = bookings.map((booking) => ({
    customer_name: booking.customer_name,
    room_name: rooms.find((r) => r.id === booking.room_id).name,
    date: booking.date,
    start_time: booking.start_time,
    end_time: booking.end_time,
  }));

  // sending list of customer bookings
  res.status(200).json(customerBookings);
});

// 5. showing how many times a customer has booked the room
app.get("/data/customers/history", (req, res) => {
  // as map returns every
  // item => if it exists returns the booking, else it returns false, so we need to filter to boolean values
  const customerHistory = bookings
    .map((booking) => {
      if (booking.customer_name === req.query.customer_name) {
        return {
          customer_name: booking.customer_name,
          room_name: rooms.find((r) => r.id === booking.room_id).name,
          date: booking.date,
          start_time: booking.start_time,
          end_time: booking.end_time,
          booking_id: booking.id,
          booking_date: "2023-01-01", // Placeholder for actual booking dates
          booking_status: "confirmed", // Placeholder for actual booking status
        };
      }
    })
    .filter(Boolean);

  // sending the customer booking history
  res.status(200).json(customerHistory);
});

// to start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  // to check our api is working or not while we deployed
  res.send(`<h2 style = "text-align: center">Welcome to Hall Booking API</h2>`);
});
