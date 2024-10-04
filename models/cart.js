const mongoose = require('mongoose');
const Joi = require('joi');

// Cart schema (Mongoose)
const cartSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Refers to the User collection
            required: true,
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Refers to the Product collection
                required: true,
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
            min: 0, // Ensuring totalPrice is a non-negative number
        },
    },
    { timestamps: true }
);

// Mongoose model
const cartModel = mongoose.model('Cart', cartSchema);

// Joi schema for validation
const cartSchemaValidation = Joi.object({
    user: Joi.string().hex().length(24).required().messages({
        'string.length': 'Invalid user ID format',
    }),
    products: Joi.array().items(
        Joi.string().hex().length(24).required().messages({
            'string.length': 'Invalid product ID format',
        })
    ).min(1).required().messages({
        'array.min': 'Cart must contain at least one product',
    }),
    totalPrice: Joi.number().min(0).required().messages({
        'number.min': 'Total price must be a non-negative value',
    }),
});

// Validation function for cart data
const validateCart = (data) => {
    return cartSchemaValidation.validate(data);
};

// Exporting Mongoose model and Joi validation function
module.exports = {
    cartModel,
    validateCart,
};
