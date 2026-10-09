require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;
const ENV = process.env.ENV;
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const SALT_ROUNDS = process.env.SALT_ROUNDS;
const JWT_SECRET = process.env.JWT_SECRET;
// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

module.exports = {
  MONGODB_URI,
  ENV,
  HOST,
  PORT,
  SALT_ROUNDS,
  JWT_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
};
