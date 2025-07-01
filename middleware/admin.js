const jwt = require("jsonwebtoken");
const {JWT_ADMIN} = require("../config");

function adminMiddleware(req, res, next){
    const token = req.headers.token;
    const decoded = jwt.verify(token, JWT_ADMIN);

    if (decoded) {
        req.adminId = decoded.indexOf;
        next();
    } else { 
        res.status(403).json({
            message : "you are not signed in"
        })
    }

}

module.exports = {
    adminMiddleware
}