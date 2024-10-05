const express = require('express');
const router = express.Router();
const {productModel} = require('../models/product');
const { cartModel, validateCart } = require('../models/cart');
const {validateAdmin, userIsLoggedIn } = require('../middlewares/admin');

router.get('/', userIsLoggedIn, async function (req, res) {
    try {
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
        let somethingInCart = false;
        let cart = await cartModel.findOne({user: req.session.passport.user})
        
        if(cart && cart.products.length > 0) somethingInCart = true;

        let rnproducts = await productModel.aggregate([{ $sample: { size: 3 } }]) || [];

        //console.log(rnproducts); 

        // Restructure the array into an object
        const formattedResult = result.reduce((acc, curr) => {
            acc[curr.category] = curr.products;
            return acc;
        }, {});

        res.render("index",{
            products: formattedResult,
            rnproducts, somethingInCart, 
            cartCount: cart ?cart.products.length : 0,
        });

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error' }); // Send an error response
    }
});

router.get('/map/:orderid', function (req, res) {
    res.render("map", { orderid: req.params.orderid });
});

module.exports = router;