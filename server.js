//setup mongodb cnx
//import mongoose
const mongoose = require('mongoose');

const {MONGODB_URI} = require('./utils/config.js');
const PORT = process.env.PORT || 10000;
const app = require('./app');

//connect to mongodbb url
const dns=require('dns')
dns.setServers(['8.8.8.8','8.8.4.4'])

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('connected to MongoDB');
    //start server after successful connection
    app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
})
    .on('error', (error) => {
        console.log('error starting server:', error.message);
    })
})
.catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
})