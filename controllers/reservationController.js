const Reservation = require("../models/reservation");
const Restaurant = require("../models/restaurant");

const reservationController = {
  //check Availability
  checkAvailability: async (req, res) => {
    try {
      const { restaurantId, date, time, partySize } = req.query;
      const existingReservations = await Reservation.find({
        restaurant: restaurantId,
        date: new Date(date),
        time: time,
        status: "confirmed",
      });
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({
          message: "Restaurant not found",
        });
      }
      const bookedSeats = existingReservations.reduce(
        (total, reservation) => total + reservation.partySize,
        0,
      );
      const availableSeats = restaurant.totalTables * 4 - bookedSeats;
      res.status(200).json({
        restaurantId,
        restaurantName:restaurant.name,
        date,
        time,
        requestedPartySize: Number(partySize),
        availableSeats,
        available: availableSeats >= Number(partySize),
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to check availability",
        error: error.message,
      });
    }
  },

  createReservation: async (req, res) => {
    try {
      //required details extracting from request body
      const { restaurantId, date, time, partySize } = req.body;

      const userId = req.userId;
      //finding restaurant by Id
      const restaurant = await Restaurant.findById(restaurantId);
      //if not exist return 404 error
      if (!restaurant) {
        return res.status(404).json({
          message: "Restaurant not found",
        });
      }
      //finding existing reservations
      const existingReservations = await Reservation.find({
        restaurant: restaurantId,
        date: new Date(date),
        time: time,
        status: "confirmed",
      });
      //finding bookedseats
      const bookedSeats = existingReservations.reduce(
        (total, reservation) => total + reservation.partySize,
        0,
      );
      //checking available seats
      const availableSeats = restaurant.totalTables * 4 - bookedSeats;

      if (availableSeats < partySize) {
        return res.status(400).json({
          message: "Not enough tables available",
        });
      }
      //creating new reservation
      const reservation = await Reservation.create({
        user: userId,
        restaurant: restaurantId,
        date,
        time,
        partySize,
        status: "confirmed",
      });
      // Fetch reservation with restaurant details
      const populatedReservation = await Reservation.findById(
        reservation._id,
      ).populate("restaurant", "name");

      res.status(201).json({
        message: "Reservation created successfully",
        reservation,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to create reservation",
        error: error.message,
      });
    }
  },
  // Get user's reservations
  getUserReservations: async (req, res) => {
    try {
      const reservations = await Reservation.find({
        user: req.userId,
      })
        .populate("restaurant", "name location cuisine imageUrl")
        .sort({ date: 1 });

      res.status(200).json({
        reservations,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch reservations",
        error: error.message,
      });
    }
  },
  // Cancel reservation
  cancelReservation: async (req, res) => {
    try {
      const reservation = await Reservation.findOne({
        _id: req.params.id,
        user: req.userId,
      });

      if (!reservation) {
        return res.status(404).json({
          message: "Reservation not found",
        });
      }

      reservation.status = "cancelled";

      await reservation.save();

      res.status(200).json({
        message: "Reservation cancelled successfully",
        reservation,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to cancel reservation",
        error: error.message,
      });
    }
  },
};
module.exports = reservationController;
