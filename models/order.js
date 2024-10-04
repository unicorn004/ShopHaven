const mongoose = require('mongoose');
const Joi = require('joi');

// Order schema (Mongoose)
const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Refers to User collection
            required: true,
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Refers to Product collection
                required: true,
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
            min: 0, // Ensures total price is non-negative
        },
        address: {
            type: String,
            required: true,
            minlength: 5, // Ensures address has at least 5 characters
        },
        status: {
            type: String,
            enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], // Limited to these statuses
            default: 'Pending',
        },
        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment', // Refers to Payment collection
            required: true,
        },
        delivery: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Delivery', // Refers to Delivery collection
        },
    },
    { timestamps: true }
);

// Mongoose model
const orderModel = mongoose.model('Order', orderSchema);

// Joi schema for validation
const orderSchemaValidation = Joi.object({
    user: Joi.string().hex().length(24).required().messages({
        'string.length': 'Invalid user ID format',
        'any.required': 'User ID is required',
    }),
    products: Joi.array().items(Joi.string().hex().length(24).required()).min(1).required().messages({
        'array.min': 'At least one product is required',
        'string.length': 'Invalid product ID format',
        'any.required': 'Product ID is required',
    }),
    totalPrice: Joi.number().min(0).required().messages({
        'number.min': 'Total price must be a non-negative number',
        'any.required': 'Total price is required',
    }),
    address: Joi.string().min(5).required().messages({
        'string.min': 'Address must be at least 5 characters long',
        'any.required': 'Address is required',
    }),
    status: Joi.string().valid('Pending', 'Shipped', 'Delivered', 'Cancelled').messages({
        'any.only': 'Status must be one of Pending, Shipped, Delivered, or Cancelled',
    }),
    payment: Joi.string().hex().length(24).required().messages({
        'string.length': 'Invalid payment ID format',
        'any.required': 'Payment ID is required',
    }),
    delivery: Joi.string().hex().length(24).allow(null, '').messages({
        'string.length': 'Invalid delivery ID format',
    }),
});

// Validation function for order data
const validateOrder = (data) => {
    return orderSchemaValidation.validate(data);
};

// Exporting Mongoose model and Joi validation function
module.exports = {
    orderModel,
    validateOrder,
};
