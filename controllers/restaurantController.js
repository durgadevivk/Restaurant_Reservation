const Restaurant = require("../models/restaurant.js");
const cloudinary = require("../config/cloudinary.js");
const mongoose = require("mongoose");
const User = require("../models/user");
const restaurantController = {
  
  //creating the restaurant
  createRestaurant: async (req, res) => {
    try {
      const {
        name,
        description,
        cuisine,
        location,
        priceRange,
        totalTables,
        image,
        menu,
        openingHours,
        contactNumber,
        dietaryOptions,
        ambiance,
        specialFeatures,
      } = req.body;
      if (
        !name ||
        !description ||
        !cuisine ||
        !location ||
        !priceRange ||
        !totalTables ||
        !image
      ) {
        return res.status(400).json({
          message: "All restaurant fields are required",
        });
      }
      const restaurant = new Restaurant({
        name,
        description,
        cuisine,
        location,
        priceRange,
        totalTables,
        image,
          dietaryOptions,
      ambiance,
      specialFeatures,
        menu: menu || [],
        openingHours: openingHours || "",
        contactNumber: contactNumber || "",
        owner: req.userId,
      });

      await restaurant.save();

      return res.status(201).json({
        message: "Restaurant created successfully",
        restaurant,
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },
  GetAllRestaurants: async (req, res) => {
    try {
      const { search, cuisine, location, priceRange,dietary,
  ambiance,
  specialFeatures, } = req.query;

      // Build filter object
      const filter = {};

      // Search by restaurant name
      if (search) {
        filter.name = {
          $regex: search,
          $options: "i",
        };
      }

      // Filter by cuisine
      if (cuisine) {
        filter.cuisine = {
          $regex: cuisine,
          $options: "i",
        };
      }

      // Filter by location
      if (location) {
        filter.location = {
          $regex: location,
          $options: "i",
        };
      }

      // Filter by price range
      if (priceRange) {
        filter.priceRange = priceRange;
      }
// Filter by dietary option
if (dietary) {
  filter.dietaryOptions = dietary;
}

// Filter by ambiance
if (ambiance) {
  filter.ambiance = ambiance;
}

// Filter by special feature
if (specialFeatures) {
  filter.specialFeatures = specialFeatures;
}
      const restaurants = await Restaurant.find(filter);

      return res.status(200).json({
        restaurants,
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },
  GetRestaurantByID: async (req, res) => {
    try {
      const { id } = req.params;

      const restaurant = await Restaurant.findById(id);

      if (!restaurant) {
        return res.status(404).json({
          message: "Restaurant not found",
        });
      }

      return res.status(200).json({
        restaurant,
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },
  getOwnerRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findOne({
        owner: req.userId,
      });

      if (!restaurant) {
        return res.status(404).json({
          message: "Restaurant not found for this owner",
        });
      }

      return res.status(200).json({
        restaurant,
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },
  updateRestaurant: async (req, res) => {
  try {
    const { id } = req.params;

    let restaurant;

    if (req.user.role === "admin") {
      // Admin can update any restaurant
      restaurant = await Restaurant.findById(id);
    } else {
      // Restaurant owner can update only their own restaurant
      restaurant = await Restaurant.findOne({
        _id: id,
        owner: req.userId,
      });
    }

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found or you are not authorized",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "cuisine",
      "location",
      "priceRange",
      "totalTables",
      "image",
      "menu",
      "openingHours",
      "contactNumber",
      "dietaryOptions",
      "ambiance",
      "specialFeatures",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        restaurant[field] = req.body[field];
      }
    });

    await restaurant.save();

    return res.status(200).json({
      message: "Restaurant updated successfully",
      restaurant,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
},
deleteRestaurant: async (req, res) => {
  try {
    const { id } = req.params;

    let restaurant;

    if (req.user.role === "admin") {
      // Admin can delete any restaurant
      restaurant = await Restaurant.findById(id);
    } else {
      // Owner can delete only their own restaurant
      restaurant = await Restaurant.findOne({
        _id: id,
        owner: req.userId,
      });
    }

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found or you are not authorized",
      });
    }

    await Restaurant.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
},
uploadRestaurantImage: async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image to upload",
      });
    }

    let restaurant;

    if (req.user.role === "admin") {
      restaurant = await Restaurant.findById(req.params.id);
    } else {
      restaurant = await Restaurant.findOne({
        _id: req.params.id,
        owner: req.userId,
      });
    }
const check = await Restaurant.collection.findOne({
  _id: restaurant?._id,
});

console.log("Raw MongoDB document:", check);
console.log("Mongoose restaurant owner:", restaurant?.owner);
    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found or you are not authorized",
      });
    }

    const imageData = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(imageData, {
      folder: "restaurant-reservation",
      resource_type: "image",
    });
console.log("Restaurant ID:", restaurant?._id);
console.log("Restaurant owner:", restaurant?.owner);
console.log("Restaurant image before save:", restaurant?.image);
    restaurant.image = result.secure_url;
    await restaurant.save();

    return res.status(200).json({
      message: "Restaurant image uploaded successfully",
      restaurant,
      image: result.secure_url,
    });
  } catch (error) {
    console.error("Restaurant image upload failed:", error);

    return res.status(500).json({
      message: "Failed to upload restaurant image",
    });
  }
},

};
module.exports = restaurantController;
