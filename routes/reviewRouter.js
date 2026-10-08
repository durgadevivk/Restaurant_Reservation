const express = require("express");

const {
  createReview,
  getRestaurantReviews,
  updateReview,
  deleteReview,
  ownerResponse,
  getAllReviews,
  adminDeleteReview
} = require("../controllers/reviewController.js");

const {
  isAuthenticated,allowRoles
} = require("../middlewares/auth.js");

const reviewRouter = express.Router();

// Create a review
reviewRouter.post(
  "/",
  isAuthenticated,
  createReview
);

// Get reviews for a restaurant
reviewRouter.get(
  "/restaurant/:restaurantId",
  getRestaurantReviews
);

// Update own review
reviewRouter.put(
  "/:id",
  isAuthenticated,
  updateReview
);

// Delete own review
reviewRouter.delete(
  "/:id",
  isAuthenticated,
  deleteReview
);
//add owner response
reviewRouter.patch(
  "/:id/owner-response",
  isAuthenticated,
  ownerResponse
);
// Admin: Get all reviews
reviewRouter.get(
  "/admin/all",
  isAuthenticated, allowRoles(["admin"]),
  getAllReviews
);

// Admin: Delete any review
reviewRouter.delete(
  "/admin/:id",
  isAuthenticated, allowRoles(["admin"]),
  adminDeleteReview
);

module.exports = reviewRouter;