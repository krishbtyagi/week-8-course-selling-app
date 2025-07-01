const {Router} = require("express");
const adminRouter = Router();
const {adminModel} = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_ADMIN = "123admin321";

adminRouter.post("/signup", async function(req, res){
    const {email, password, firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try{
        await adminModel.create({
            email: email,
            password : hashedPassword,
            firstName: firstName,
            lastName: lastName
        })
    res.json({
        message : "signup succeeded"
    })    
    } catch(error){
        res.json({message : "failed"});
        console.error(error);
    }
})

adminRouter.post("/signin", async function(req, res){
    const email = req.body.email;
    const password = req.body.password;

    const admin = await adminModel.findOne({
        email: email
    });

    const passwordMatch = bcrypt.compare(password, admin.password);
    if(admin && passwordMatch){
        const token = jwt.sign({
            id: admin._id.toString()
        }, JWT_ADMIN,
        { expiresIn : '1d'}
    );
        res.json({
            token
        })
    }else {
        res.status(403).json({
            message : "incorrect creds"
        })
    }
})

adminRouter.post("/course", function(req, res){
    res.json({
        message : "signin endpoint"
    })
})

adminRouter.put("/course", function(req, res){
    res.json({
        message : "signin endpoint"
    })
})

adminRouter.get("/course/bulk", function(req, res){
    res.json({
        message : "signin endpoint"
    })
})

module.exports = {
    adminRouter: adminRouter
}
