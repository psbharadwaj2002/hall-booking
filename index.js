const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

const rooms = [];
const bookings = [];

app.use(bodyParser.json());

// endpoint to create a room
app.post("/create-room", (req, res) => {
  const data = req.body;

  // check if all the required data was entered or not
  if (!data.roomName || !data.capacity || !data.pricePerHour) {
    return res.status(400).json({ error: "Incomplete room information" });
  }

  const room = {
    roomId: rooms.length + 1,
    roomName: data.roomName,
    capacity: data.capacity,
    pricePerHour: data.pricePerHour,
    available: true,
  };
  rooms.push(room);
  res.status(201).json({ message: "Room created successfully" });
});

// endpoint to book a room
app.post("/book-room", (req, res) => {
  const data = req.body;

  // check if all the required data was entered or not
  if (!data.customerName || !data.startTime || !data.endTime || !data.roomId) {
    return res.status(400).json({ error: "Incomplete booking information" });
  }

  // check if the room is available for the specified time slot
  const conflictingBooking = bookings.find(
    (booking) =>
      booking.roomId === data.roomId &&
      ((data.startTime >= booking.startTime &&
        data.startTime < booking.endTime) ||
        (data.endTime > booking.startTime && data.endTime <= booking.endTime))
  );

  if (conflictingBooking) {
    return res
      .status(400)
      .json({ error: "Room already booked for the given time slot" });
  }

  // check if the room exists or not
  const room = rooms.find((room) => room.roomId === data.roomId);
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  // to book the room
  const booking = {
    bookingId: bookings.length + 1,
    customerName: data.customerName,
    startTime: data.startTime,
    endTime: data.endTime,
    roomId: data.roomId,
  };
  bookings.push(booking);

  // once booked, update room availability
  room.available = false;

  res.status(201).json({ message: "Room booked successfully" });
});

// endpoint to list all rooms with booked data
app.get("/list-rooms", (req, res) => {
  const roomsWithBookings = rooms.map((room) => {
    const roomBookings = bookings.filter(
      (booking) => booking.roomId === room.roomId
    );
    return {
      roomName: room.roomName,
      capacity: room.capacity,
      pricePerHour: room.pricePerHour,
      available: room.available,
      bookings: roomBookings,
    };
  });
  res.json(roomsWithBookings);
});

// to start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
