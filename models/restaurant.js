
const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    cuisine: {
        type: String,
        required: true,
        trim: true
    },

    location: {
        type: String,
        required: true,
        trim: true
    },

    priceRange: {
        type: String,
        required: true,
        enum: ['100-500', '501-1000', '1001-5000', '10000']
    },

    totalTables: {
        type: Number,
        required: true,
        min: 1
    },

    image: {
        type: String,
        required: true
    },

    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
