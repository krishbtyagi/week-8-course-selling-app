require('dotenv').config();

JWT_ADMIN = process.env.JWT_ADMIN;
JWT_USER = process.env.JWT_USER;


module.exports = {
    JWT_ADMIN,
    JWT_USER
}