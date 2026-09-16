//setup mongodb cnx
//import mongoose
const mongoose = require('mongoose');

const {MONGODB_URI, HOST,PORT} = require('./utils/config.js');
const app = require('./app');

//connect to mongodbb url
const dns=require('dns')
dns.setServers(['8.8.8.8','8.8.4.4'])

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('connected to MongoDB');
    //start server after successful connection
    app.listen(PORT,HOST, () => {
        console.log(`Server running on http://${HOST}:${PORT}`);
    })
    .on('error', (error) => {
        console.log('error starting server:', error.message);
    })
})
.catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
})