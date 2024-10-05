const express = require("express");
const router = express.Router();
const { adminModel } = require("../models/admin");
const { productModel } = require("../models/product");
const { categoryModel } = require('../models/category');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {validateAdmin} = require("../middlewares/admin");

require("dotenv").config();

if(typeof process.env.NODE_ENV !== undefined && process.env.NODE_ENV  === "DEVELOPMENT"){
   try{
    router.get("/create", async function(req, res) {

        let salt= await bcrypt.genSalt();
        let hash = await bcrypt.hash("admin",salt);

        let user = new adminModel({
            name: "Tanmay Sinkar",
            email: "tanmaysinkar@gmail.com",
            password: hash,
            role: "admin",
        });

       await user.save();
       let token = jwt.sign({email: "tanmaysinkar@gmail.com", admin: true }, process.env.JWT_KEY);
       res.cookie("token", token);
       res.send("Admin created successfully!");
    });
   }
   catch(error){
      res.send(error.message);
   }
}

router.get("/login", function(req, res) {
    res.render("admin_login");
});

router.post("/login", async function(req, res) {
    let {email, password} = req.body;
    let admin = await adminModel.findOne({email});
    if(!admin){
        return res.send("This admin is not available");
    }
    let valid = await bcrypt.compare(password,admin.password);
    if(valid){
       let token = jwt.sign({email: "tanmaysinkar@gmail.com", admin: true}, process.env.JWT_KEY);
       res.cookie("token", token);
       res.redirect("/admin/dashboard");
    }
   
});

router.get("/dashboard", validateAdmin, async function(req, res) {
    try {
        const prodcount = await productModel.countDocuments(); // Count total products
        const categcount = await categoryModel.countDocuments(); // Count total categories

        res.render("admin_dashboard", { prodcount, categcount });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/products", validateAdmin, async function(req, res) {
    const result = await productModel.aggregate([
        {
            $lookup: {
                from: 'categories', // The Category collection
                localField: 'category', // The field in the Product schema
                foreignField: '_id', // The field in the Category schema
                as: 'categoryDetails'
            }
        },
        {
            $unwind: '$categoryDetails' // Flatten the category details array
        },
        {
            $group: {
                _id: '$categoryDetails.name', // Group by category name
                products: { $push: "$$ROOT" } // Push the entire product document
            }
        },
        {
            $project: {
                _id: 0,
                category: "$_id",
                products: { $slice: ["$products", 10] } // Get only the first 10 products from each group
            }
        }
    ]);

    // Restructure the array into an object
    const formattedResult = result.reduce((acc, curr) => {
        acc[curr.category] = curr.products;
        return acc;
    }, {});

    res.render("admin_products", { products: formattedResult });
});


router.get("/logout", validateAdmin, function(req, res) {
    res.cookie("token","");
    res.redirect("/admin/login");
});

module.exports = router;