const express = require("express");

const {
  checkAvailability,
  createReservation,
  getUserReservations,
  cancelReservation,
  updateReservation
} = require("../controllers/reservationController.js");

const { isAuthenticated } = require("../middlewares/auth.js");

const reservationRouter=express.Router();

// Check availability
reservationRouter.get("/availability", checkAvailability);

// Create reservation
reservationRouter.post("/", isAuthenticated, createReservation);

// Get logged-in user's reservations
reservationRouter.get("/my", isAuthenticated, getUserReservations);

// Cancel reservation
reservationRouter.patch("/:id", isAuthenticated, cancelReservation);
//update reservation
reservationRouter.put('/:id',isAuthenticated,updateReservation)

module.exports = reservationRouter;