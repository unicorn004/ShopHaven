const express = require('express');
const router = express.Router();
const { paymentModel } = require('../models/payment');
const  { orderModel } = require('../models/order');
const { cartModel } = require('../models/cart');

router.get('/:userid/:orderid/:paymentid/:signature', async (req, res) => {
    let paymentDetails = await paymentModel.findOne({
        orderId: req.params.orderid,
    })

    if(!paymentDetails) return res.send("This payment does not exist");

    if(req.params.signature === paymentDetails.signature && paymentDetails.paymentId === req.params.paymentid){

        let cart = await cartModel.findOne({
            user: req.params.userid,
        });
        if (!cart) return res.status(404).send("Cart not found");

        await orderModel.create({
            orderId: req.params.orderid,
            user: req.params.userid,
            products: cart.products,
            totalPrice: cart.totalPrice,
            status: 'Pending',
            payment: paymentDetails._id,
        });

        await cartModel.updateOne({ user: req.params.userid }, { $set: { products: [] } });

        res.redirect(`/map/${req.params.orderid}`);
    }
    else{
        res.send("Payment is Invalid");
    }
});

router.post('/address/:orderid', async (req, res) => {
    let order = await orderModel.findOne({
        orderId: req.params.orderid,
    });
    if(!order) return res.status(404).send("Order not found");
    if(!req.body.address) return res.status(400).send("Address not found");

    order.address = req.body.address;

    await order.save();
    res.redirect("/");
});

module.exports = router;