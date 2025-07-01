const {Router} = require("express");
const {userModel, purchaseModel, courseModel} = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = Router();
const {JWT_USER} = require("../config");
const { userMiddleware } = require("../middleware/user");


userRouter.post("/signup", async function(req,res){
    const {email, password, firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try{
        await userModel.create({
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
 
userRouter.post("/signin", async function(req,res){
    const email = req.body.email;
    const password = req.body.password;

    const user = await userModel.findOne({
        email: email
    });

    const passwordMatch = bcrypt.compare(password, user.password);
    if(user && passwordMatch){
        const token = jwt.sign({
            id: user._id.toString()
        }, JWT_USER,
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
});

userRouter.get("/purchases", userMiddleware, async function(req,res){
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId
    })
    const coursesData = await courseModel.find({
        _id : { $in : purchases.map( x => x.courseId) }
    })
    res.json({
        purchases,
        coursesData
    })
})

module.exports = {
    userRouter : userRouter
}