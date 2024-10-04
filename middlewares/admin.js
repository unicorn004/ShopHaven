const jwt = require("jsonwebtoken"); 
require("dotenv").config();

async function validateAdmin (req, res, next){
    try{
        let token = req.cookies.token;
    if(!token){
        return res.status(401).json({ error: 'Unauthorized' });
    }
    let data = await jwt.verify(token,process.env.JWT_KEY);
    req.user = data;
    next();
    }
    catch(err){
        res.send(err.message);
    }
}

module.exports = validateAdmin;