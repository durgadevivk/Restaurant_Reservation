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
    // Required details extracting from request body
    const { restaurantId, date, time, partySize } = req.body;

    const userId = req.userId;

    // Finding restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);

    // If restaurant does not exist
    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    // Finding existing confirmed reservations
    const existingReservations = await Reservation.find({
      restaurant: restaurantId,
      date: new Date(date),
      time: time,
      status: "confirmed",
    });

    // Finding booked seats
    const bookedSeats = existingReservations.reduce(
      (total, reservation) => total + reservation.partySize,
      0
    );

    // Checking available seats
    const availableSeats = restaurant.totalTables * 4 - bookedSeats;

    if (availableSeats < partySize) {
      return res.status(400).json({
        message: "Not enough tables available",
      });
    }

    // Creating new reservation
    const reservation = await Reservation.create({
      user: userId,
      restaurant: restaurantId,
      date,
      time,
      partySize,
      status: "pending",
    });

    // Fetch reservation with restaurant details
    const populatedReservation = await Reservation.findById(
      reservation._id
    ).populate("restaurant", "name");

    res.status(201).json({
      message: "Reservation created successfully",
      reservation: populatedReservation,
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
  //update reservation
  updateReservation: async (req, res) => {
  try {
    const { date, time, partySize } = req.body;

    // Validate input
    if (!date || !time || !partySize) {
      return res.status(400).json({
        message: "Date, time and party size are required",
      });
    }

    const reservation = await Reservation.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found",
      });
    }

    // Do not allow updating cancelled reservation
    if (reservation.status === "cancelled") {
      return res.status(400).json({
        message: "Cancelled reservation cannot be updated",
      });
    }

    // Check availability for the new booking
    const existingReservations = await Reservation.find({
      restaurant: reservation.restaurant,
      date: new Date(date),
      time: time,
      status: "confirmed",
      _id: { $ne: reservation._id },
    });

    const restaurant = await Restaurant.findById(reservation.restaurant);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    const bookedSeats = existingReservations.reduce(
      (total, reservation) => total + reservation.partySize,
      0
    );

    const availableSeats =
      restaurant.totalTables * 4 - bookedSeats;

    if (availableSeats < Number(partySize)) {
      return res.status(400).json({
        message: "Not enough tables available for the updated reservation",
      });
    }

    // Update reservation
    reservation.date = date;
    reservation.time = time;
    reservation.partySize = partySize;

    await reservation.save();

    const updatedReservation = await Reservation.findById(
      reservation._id
    ).populate("restaurant", "name location cuisine image");

    return res.status(200).json({
      message: "Reservation updated successfully",
      reservation: updatedReservation,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to update reservation",
      error: error.message,
    });
  }
},
  //admingetAllReservation
  admingetAllReservation:async(req,res)=>{
    try{
    const reservations = await Reservation.find()
      .populate("user", "name email")
      .populate("restaurant", "name location cuisine")
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      message: "All reservations fetched successfully",
      reservations,
    });
    }catch(error){
       res.status(500).json({
      message: "Failed to fetch all reservations",
      error: error.message,
    });
    }
  },
  // Admin - Confirm reservation
confirmReservation: async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found",
      });
    }

    if (reservation.status === "cancelled") {
      return res.status(400).json({
        message: "Cancelled reservation cannot be confirmed",
      });
    }

    reservation.status = "confirmed";

    await reservation.save();

    const updatedReservation = await Reservation.findById(
      reservation._id
    )
      .populate("user", "name email")
      .populate("restaurant", "name location cuisine");

    res.status(200).json({
      message: "Reservation confirmed successfully",
      reservation: updatedReservation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to confirm reservation",
      error: error.message,
    });
  }
},
// Admin - Reject reservation
rejectReservation: async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found",
      });
    }

    if (reservation.status === "cancelled") {
      return res.status(400).json({
        message: "Cancelled reservation cannot be rejected",
      });
    }

    reservation.status = "rejected";

    await reservation.save();

    const updatedReservation = await Reservation.findById(
      reservation._id
    )
      .populate("user", "name email")
      .populate("restaurant", "name location cuisine");

    res.status(200).json({
      message: "Reservation rejected successfully",
      reservation: updatedReservation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to reject reservation",
      error: error.message,
    });
  }
}



};
module.exports = reservationController;
