const express = require("express");
const User = require("../model/user.model");
const Flight = require("../model/flight.model");
const config = require("../config");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcrypt");
const middleware = require("../middleware");

router.route("/").get((req, res) => res.json("Your User Page Got it"));

//check if email is already present
router.route("/checkemail/:email").get(async (req, res) => {
  try {
    const result = await User.findOne({ email: req.params.email });
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
    return res.status(500).json({ msg: error });
  }
});

//getItemsforOptions
router.route("/getItems").get(async (req, res) => {
  const flightNames = await Flight.distinct("name").exec();
  const fromLocations = await Flight.distinct("from").exec();
  const toLocations = await Flight.distinct("to").exec();
  const response = {
    flightNames: flightNames,
    fromLocations: fromLocations,
    toLocations: toLocations,
  };
  res.status(200).json(response);
});

//search flights
router.route("/searchflights").post(async (req, res) => {
  const { flightName, fromLocation, toLocation, departureDate } = req.body;

  try {
    let flights = [];
    const query = {};
    console.log(req.body);
    if (flightName) {
      query.name = flightName;
    }

    if (fromLocation) {
      query.from = fromLocation;
    }

    if (toLocation) {
      query.to = toLocation;
    }

    if (departureDate) {
      const startDate = new Date(departureDate);
      const endDate = new Date(departureDate);
      endDate.setDate(endDate.getDate() + 1);
      query.departureDateTime = {
        $gte: startDate,
        $lt: endDate,
      };
    }
    console.log(query);

    if (Object.keys(query).length === 0) {
      flights = await Flight.find();
    } else {
      flights = await Flight.find(query);
    }
    let response = {
      status: flights.length > 0,
      message: flights.length > 0 ? "Flights found" : "No flights found",
      flights: flights,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//get flights
router.route("/getflights").get(async (req, res) => {
  try {
    const flights = await Flight.find();
    const response = {
      status: true,
      message: "Flights have been retrieved",
      flights: flights,
    };

    return res.status(200).json(response); // Send the response back to the client
  } catch (error) {
    console.error("Error fetching flights:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//book ticket
router
  .route("/bookflight")
  .post(middleware.checkUserToken, async (req, res) => {
    console.log(Flight.currcapacity);
    try {
      if (existingFlight) {
        existingFlight.count += count;
      } else {
        User.flights.push({ name: flightname, count: count });
      }

      if (!Flight) {
        return res.json({
          message: "Flight not found",
          status: false,
        });
      }

      if (Flight.currcapacity + count > Flight.maxcapacity) {
        return res.json({
          message: "Maximum Capacity Reached",
          status: false,
        });
      }

      Flight.currcapacity += count;

      await User.save();
      await Flight.save();

      return res.status(200).json({
        message: "Ticket booked successfully",
        status: true,
      });
    } catch (error) {
      console.log(error);
      return res.json({
        error: "Internal Server Error",
      });
    }
  });

//return all flights booked by user
router
  .route("/getuserflights")
  .post(middleware.checkUserToken, async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const bookedFlights = user.flights;
      const flights = [];

      for (const bookedFlight of bookedFlights) {
        const { name, count } = bookedFlight;
        const flight = await Flight.findOne({ name });
        if (flight) {
          flights.push({ flight: flight, count });
        }
      }

      const response = {
        status: true,
        message: "User flights have been retrieved",
        flights,
      };

      return res.json(response);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

//cancelbooking
router
  .route("/cancelflight")
  .post(middleware.checkUserToken, async (req, res) => {
    const { email, flightname } = req.body;

    try {
      const user = await User.findOne({ email: email });

      const flight = await Flight.findOne({ name: flightname });

      const bookedFlight = user.flights.find(
        (flight) => flight.name === flightname
      );

      if (!bookedFlight) {
        return res.json({
          message: "Flight not booked by the user",
          status: false,
        });
      }

      flight.currcapacity -= bookedFlight.count;

      user.flights = user.flights.filter(
        (flight) => flight.name !== flightname
      );

      await user.save();
      await flight.save();

      return res
        .status(200)
        .json({ msg: "Flight cancelled successfully", status: true });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

//login function
router.route("/login").post(async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user === null) {
      return res.status(403).json("Email/Password is incorrect");
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (isPasswordValid) {
      let token = jwt.sign(
        { email: req.body.email, isAdmin: false },
        config.key,
        {}
      );
      return res.status(200).json({
        email: req.body.email,
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
    return res.status(500).json({ msg: error });
  }
});

//register function
router.route("/register").post(async (req, res) => {
  try {
    const { username, password, email } = req.body;
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username: username,
      password: hashedPassword,
      email: email,
    });
    console.log(req.body + user);
    await user
      .save()
      .then(() => {
        res
          .status(200)
          .json({ message: "User Successfully Registered", status: true });
      })
      .catch((err) => {
        res.json({ message: JSON.stringify(err), status: false });
      });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

module.exports = router;
