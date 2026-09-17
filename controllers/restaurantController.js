const Restaurant = require('../models/restaurant.js');
const restaurantController={
    //creating the restaurant
    createRestaurant:async(req,res)=>{
        try{
        const {
                name,
                description,
                cuisine,
                location,
                priceRange,
                totalTables,
                image
            } = req.body;
            if (
                !name ||
                !description ||
                !cuisine ||
                !location ||
                !priceRange ||
                !totalTables ||
                !image
            )
            {
                return res.status(400).json({
                    message: 'All restaurant fields are required'
                });
            }
        const restaurant = new Restaurant({
                name,
                description,
                cuisine,
                location,
                priceRange,
                totalTables,
                image
            });

            await restaurant.save();

            return res.status(201).json({
                message: 'Restaurant created successfully',
                restaurant
            });
        }catch(error){
            return res.status(500).json({
                error: e.message
            });
        }
    },
    GetAllRestaurants:async(req,res)=>{
        try{
            const restaurants = await Restaurant.find();
            return res.status(200).json({
                restaurants
            });
        }catch(error){
            return res.status(500).json({
                error: e.message
            });
        }
    },
    GetRestaurantByID:async(req,res)=>{
        try{
             const { id } = req.params;

            const restaurant = await Restaurant.findById(id);

            if (!restaurant) {
                return res.status(404).json({
                    message: 'Restaurant not found'
                });
            }

            return res.status(200).json({
                restaurant
            });

        }catch(error){
            return res.status(500).json({
                error: e.message
            });
        }
    },
    updateRestaurant:async(req,res)=>{
        try{
             const { id } = req.params;

            const restaurant = await Restaurant.findByIdAndUpdate(
                id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!restaurant) {
                return res.status(404).json({
                    message: 'Restaurant not found'
                });
            }

            return res.status(200).json({
                message: 'Restaurant updated successfully',
                restaurant
            });

        }catch(error){
            return res.status(500).json({
                error: e.message
            });
        }
    },
    deleteRestaurant:async(req,res)=>{
            try{
                const { id } = req.params;

            const restaurant = await Restaurant.findByIdAndDelete(id);

            if (!restaurant) {
                return res.status(404).json({
                    message: 'Restaurant not found'
                });
            }

            return res.status(200).json({
                message: 'Restaurant deleted successfully'
            });

        }catch(error){
            return res.status(500).json({
                error: e.message
            });
        }
    },
}
module.exports = restaurantController;