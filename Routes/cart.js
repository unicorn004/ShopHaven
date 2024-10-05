const express = require('express');
const router = express.Router();
const { cartModel, validateCart } = require('../models/cart');
const {validateAdmin,userIsLoggedIn} = require('../middlewares/admin');
const { productModel } = require('../models/product');
router.get('/',userIsLoggedIn, async function(req, res){
    try{
        let cart = await cartModel.findOne({user: req.session.passport.user }).populate("products");

        let cartDataStructure = {};

        cart.products.forEach(product => {
            let key = product._id.toString();
            if(cartDataStructure[key]){
                cartDataStructure[key].quantity +=1;
            }
            else{
                cartDataStructure[key] = {
                    ...product._doc,
                    quantity: 1,
                };
            }

        });
        let finalarray = Object.values(cartDataStructure);

        let finalprice = cart.totalPrice + 34;

        res.render("cart",{cart: finalarray, finalprice: finalprice, userid: req.session.passport.user, });
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

router.get('/add/:id',userIsLoggedIn, async function(req, res){
    try{
        let cart = await cartModel.findOne({user: req.session.passport.user });
        let product = await productModel.findOne({ _id: req.params.id});
        if(!cart){
            cart = await cartModel.create({
                user: req.session.passport.user,
                products: [req.params.id],
                totalPrice: Number(product.price),
            });
        }
        else{
            cart.products.push(req.params.id);
            cart.totalPrice += Number(product.price);

            await cart.save();
        }
       res.redirect("back");
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

router.get('/remove/:id',userIsLoggedIn, async function(req, res){
    try{
        let cart = await cartModel.findOne({user: req.session.passport.user });
        let product = await productModel.findOne({ _id: req.params.id});

        if(!cart){
            res.send("Cart not found");
        }
        else{
            let index = cart.products.indexOf(req.params.id);
            if(index !== -1) cart.products.splice(index,1);
            else return res.send("Item is not in the cart");

            await cart.save();
            cart.totalPrice -= Number(product.price);
            res.redirect("back");
        }
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

module.exports = router;
