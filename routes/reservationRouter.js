const express = require("express");

const {
  checkAvailability,
  createReservation,
  getUserReservations,
  cancelReservation,
  updateReservation,
  admingetAllReservation,
  confirmReservation,rejectReservation  
} = require("../controllers/reservationController.js");

const { isAuthenticated,allowRoles } = require("../middlewares/auth.js");

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
reservationRouter.put('/:id',isAuthenticated,updateReservation);
//admin get all reservations
reservationRouter.get(
  "/admin/all",
  isAuthenticated,
  allowRoles(["admin"]),
  admingetAllReservation
);
// Admin - Confirm reservation
reservationRouter.patch(
  "/admin/:id/confirm",
  isAuthenticated,
  allowRoles(["admin"]),
  confirmReservation
);
// Admin - Reject reservation
reservationRouter.patch(
  "/admin/:id/reject",
  isAuthenticated,
  allowRoles(["admin"]),
  rejectReservation
);


module.exports = reservationRouter;