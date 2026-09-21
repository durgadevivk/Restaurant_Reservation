const Review = require("../models/review.js");
const Restaurant = require("../models/restaurant.js");

const reviewController = {

  // Create a review
  createReview: async (req, res) => {
    try {
      const {
        restaurantId,
        rating,
        comment,
        photos
      } = req.body;

      if (!restaurantId || !rating || !comment) {
        return res.status(400).json({
          message: "Restaurant, rating and comment are required"
        });
      }

      // Check restaurant exists
      const restaurant = await Restaurant.findById(restaurantId);

      if (!restaurant) {
        return res.status(404).json({
          message: "Restaurant not found"
        });
      }

      const review = await Review.create({
        user: req.userId,
        restaurant: restaurantId,
        rating: Number(rating),
        comment,
        photos: photos || []
      });

      const createdReview = await Review.findById(review._id)
        .populate("user", "name email")
        .populate("restaurant", "name");

      res.status(201).json({
        message: "Review created successfully",
        review: createdReview
      });

    } catch (error) {
      res.status(500).json({
        message: "Failed to create review",
        error: error.message
      });
    }
  },


  // Get all reviews for a restaurant
  getRestaurantReviews: async (req, res) => {
    try {
      const { restaurantId } = req.params;

      const reviews = await Review.find({
        restaurant: restaurantId
      })
        .populate("user", "name")
        .sort({ createdAt: -1 });

      res.status(200).json({
        reviews
      });

    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch reviews",
        error: error.message
      });
    }
  },


  // Update own review
  updateReview: async (req, res) => {
    try {
      const { rating, comment, photos } = req.body;

      const review = await Review.findOne({
        _id: req.params.id,
        user: req.userId
      });

      if (!review) {
        return res.status(404).json({
          message: "Review not found"
        });
      }

      review.rating = rating;
      review.comment = comment;

      if (photos !== undefined) {
        review.photos = photos;
      }

      await review.save();

      res.status(200).json({
        message: "Review updated successfully",
        review
      });

    } catch (error) {
      res.status(500).json({
        message: "Failed to update review",
        error: error.message
      });
    }
  },


  // Delete own review
  deleteReview: async (req, res) => {
    try {
      const review = await Review.findOneAndDelete({
        _id: req.params.id,
        user: req.userId
      });

      if (!review) {
        return res.status(404).json({
          message: "Review not found"
        });
      }

      res.status(200).json({
        message: "Review deleted successfully"
      });

    } catch (error) {
      res.status(500).json({
        message: "Failed to delete review",
        error: error.message
      });
    }
  }

};

module.exports = reviewController;