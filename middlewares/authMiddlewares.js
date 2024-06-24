const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_key = process.env.JWT_SECRET;

const authMiddleware = (req,resp,next)=>{
    const authHeader = req.headers["authorization"];

    if(!authHeader){
        return resp.status(401).send("Unauthorized user");
    }

    const token = authHeader.split(" ")[1];

    try{
        const user = jwt.verify(token,jwt_key);
        req.user = user
    }
    catch(err){
        return resp.status(401).send("Unauthorized user");
    }
    
    next();
}


module.exports = authMiddleware