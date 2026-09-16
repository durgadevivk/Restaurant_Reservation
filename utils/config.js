 require ('dotenv').config();
    const MONGODB_URI=process.env.MONGODB_URI;
    const ENV=process.env.ENV;
    const HOST=process.env.HOST;
    const PORT=process.env.PORT;
    const SALT_ROUNDS=process.env.SALT_ROUNDS
    const JWT_SECRET=process.env.JWT_SECRET
    module.exports = {
        MONGODB_URI,
        ENV,
        HOST,
        PORT,
        SALT_ROUNDS,
        JWT_SECRET
    }