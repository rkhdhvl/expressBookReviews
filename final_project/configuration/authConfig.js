const dotenv = require("dotenv");

module.exports = {
    secret: process.env.JWT_SECRET_KEY, //secret value defined as per the environment
    expiresIn: "1h"
};
