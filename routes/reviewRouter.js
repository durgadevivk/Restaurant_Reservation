const express = require("express");

const {
  createReview,
  getRestaurantReviews,
  updateReview,
  deleteReview
} = require("../controllers/reviewController.js");

const {
  isAuthenticated
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

module.exports = reviewRouter;