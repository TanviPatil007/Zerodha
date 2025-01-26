require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};
module.exports.createSecretToken = (userId) => {
  const secretKey = process.env.JWT_SECRET;
  
  if (!secretKey) {
    throw new Error("JWT secret key is not defined in environment variables.");
  }

  return jwt.sign({ userId }, secretKey, { expiresIn: "1d" });
};