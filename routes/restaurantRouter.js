const express=require('express');
const { createRestaurant, GetAllRestaurants, GetRestaurantByID, updateRestaurant, deleteRestaurant } = require('../controllers/restaurantController');
const { isAuthenticated, allowRoles } = require('../middlewares/auth');

const restaurantRouter=express.Router();

//configure routes
restaurantRouter.post('/', isAuthenticated,
    allowRoles(['restaurant_owner', 'admin']),createRestaurant);
restaurantRouter.get('/',GetAllRestaurants);
restaurantRouter.get('/:id',GetRestaurantByID);
restaurantRouter.put('/:id',  isAuthenticated,
    allowRoles(['restaurant_owner', 'admin']),updateRestaurant);
restaurantRouter.delete('/:id',  isAuthenticated,
    allowRoles(['restaurant_owner', 'admin']),deleteRestaurant);


module.exports = restaurantRouter;
