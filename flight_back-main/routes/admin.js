const express = require("express");
const Admin = require("../model/admin.model");
const Flight = require("../model/flight.model");
const User = require("../model/user.model");

const config = require("../config");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcrypt");
const middleware = require("../middleware");

router.route("/").get((req, res) => res.json("Your Admin Page Got it"));

// to check if email already exists
router.route("/checkemail/:email").get(async (req, res) => {
  try {
    const result = await Admin.findOne({ email: req.params.email });
    if (result !== null) {
      return res.json({
        status: true,
        email: result["email"],
      });
    } else {
      return res.json({
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

//get all flight
router
  .route("/getallflights")
  .get(middleware.checkAdminToken, async (req, res) => {
    try {
      const flights = await Flight.find();
      return res.json({ flights: flights, message: "Flights received" });
    } catch (error) {
      console.error("Error retrieving flights:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

//get allUserflights
router
  .route("/getalluserflights")
  .get(middleware.checkAdminToken, async (req, res) => {
    try {
      const users = await User.find();
      const flights = [];

      for (const user of users) {
        const { email } = user;
        const bookedFlights = user.flights;

        for (const bookedFlight of bookedFlights) {
          const { name, count } = bookedFlight;
          const flight = await Flight.findOne({ name });

          if (flight) {
            flights.push({ email, flight, count });
          }
        }
      }

      const response = {
        status: true,
        message: "User flights have been retrieved",
        data: flights,
      };

      return res.json(response);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

//cancel userBooking
router
  .route("/cancelbooking")
  .post(middleware.checkAdminToken, async (req, res) => {
    const flightname = req.body.flightname;
    const email = req.body.email;
    const count = req.body.count;

    try {
      const user = await User.findOne({ email });

      const flightIndex = user.flights.findIndex(
        (flight) => flight.name === flightname
      );

      if (flightIndex !== -1) {
        user.flights.splice(flightIndex, 1);

        await user.save();

        await Flight.updateOne(
          { name: flightname },
          { $inc: { currcapacity: -count } }
        );

        res.status(200).json({
          message: "Flight booking canceled successfully",
          status: true,
        });
      } else {
        res.status(404).json({
          message: "Flight not found in user's bookings",
          status: false,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while canceling the flight booking",
      });
    }
  });

//add flight
router
  .route("/addflight")
  .post(middleware.checkAdminToken, async (req, res) => {
    try {
      const {
        name,
        from,
        departureDateTime,
        to,
        arrivalDateTime,
        price,
        currcapacity,
        maxcapacity,
      } = req.body;

      const existingFlight = await Flight.findOne({ name: name });
      console.log(existingFlight);
      if (existingFlight) {
        return res.json({ message: "Flight is already in Use", status: false });
      }

      const newFlight = new Flight({
        name: name,
        from: from,
        departureDateTime: departureDateTime,
        to: to,
        arrivalDateTime: arrivalDateTime,
        price: price,
        currcapacity: currcapacity,
        maxcapacity: maxcapacity,
      });

      await newFlight.save();
      return res
        .status(200)
        .json({ message: "Flight Added successfully", status: true });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong", status: false });
    }
  });

//delete flight
router
  .route("/deleteflight")
  .post(middleware.checkAdminToken, async (req, res) => {
    const flightName = req.body.name;

    try {
      const deletionResult = await Flight.deleteOne({ name: flightName });
      if (deletionResult.deletedCount === 0) {
        return res
          .status(200)
          .json({ message: "Flight not found", status: true });
      }
      await User.updateMany(
        { "flights.name": flightName },
        { $pull: { flights: { name: flightName } } }
      );
      return res
        .status(200)
        .json({ message: "Flight deleted successfully", status: true });
    } catch (error) {
      console.error("Error deleting the flight:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

//function to delete flight automatically after arrivaltime experies
setInterval(async () => {
  console.log("deleting exp flight");
  try {
    const currentDate = new Date();
    await Flight.deleteMany({ arrivalDateTime: { $lt: currentDate } });
  } catch (error) {
    console.log("Error occurred while deleting expired flights:", error);
  }
}, 6000000);

//login function
router.route("/login").post(async (req, res) => {
  try {
    const result = await Admin.findOne({ email: req.body.email });

    if (result === null) {
      return res.json({
        token: token,
        message: "Email/Password is incorrect",
        status: true,
      });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      result.password
    );

    if (isPasswordValid) {
      let token = jwt.sign(
        { email: req.body.email, isAdmin: true },
        config.key,
        {}
      );
      console.log(token);
      return res.status(200).json({
        token: token,
        message: "success",
        status: true,
      });
    } else {
      return res.status(200).json({
        message: "Password is incorrect",
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

//register funtion
router.route("/register").post(async (req, res) => {
  try {
    const { username, password, email, adminkey } = req.body;

    if (adminkey != config.adminkey) {
      return res.json({ message: "adminkey incorrect", status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      username: username,
      password: hashedPassword,
      email: email,
    });

    console.log(req.body + user);

    await admin
      .save()
      .then(() => {
        console.log("Admin registered");
        res
          .status(200)
          .json({ message: "Admin Successfully Registered", status: true });
      })
      .catch((err) => {
        res.json({ message: err, status: false });
      });
  } catch (error) {
    return res.json({ message: error, status: false });
  }
});

module.exports = router;
