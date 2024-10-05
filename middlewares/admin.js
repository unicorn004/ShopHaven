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

async function userIsLoggedIn(req, res, next) {
    try {
        if (req.isAuthenticated()) {
            return next(); // User is authenticated, proceed to the next middleware
        }
        // User is not authenticated, redirect to the login page
        return res.redirect('/users/login');
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error' }); // Send an error response
    }
}

module.exports = {validateAdmin, userIsLoggedIn};