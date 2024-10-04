const mongoose = require('mongoose');
const Joi = require('joi');

// Delivery schema (Mongoose)
const deliverySchema = mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order', // Refers to the Order collection
            required: true,
        },
        deliveryBoy: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50,
        },
        status: {
            type: String,
            enum: ['Pending', 'Dispatched', 'Delivered', 'Cancelled'], // Limited to these status options
            default: 'Pending',
        },
        trackingURL: {
            type: String,
            trim: true,
            match: /^https?:\/\/[^\s/$.?#].[^\s]*$/i, // URL format validation
        },
        estimatedDeliveryTime: {
            type: Number,
            min: 0, // Delivery time should be a positive number
        },
    },
    { timestamps: true }
);

// Mongoose model
const  deliveryModel = mongoose.model('Delivery', deliverySchema);

// Joi schema for validation
const deliverySchemaValidation = Joi.object({
    order: Joi.string().hex().length(24).required().messages({
        'string.length': 'Invalid order ID format',
        'any.required': 'Order ID is required',
    }),
    deliveryBoy: Joi.string().min(3).max(50).required().messages({
        'string.min': 'Delivery boy name must be at least 3 characters long',
        'string.max': 'Delivery boy name must not exceed 50 characters',
        'any.required': 'Delivery boy name is required',
    }),
    status: Joi.string().valid('Pending', 'Dispatched', 'Delivered', 'Cancelled').messages({
        'any.only': 'Status must be one of Pending, Dispatched, Delivered, or Cancelled',
    }),
    trackingURL: Joi.string().uri().allow(null, '').messages({
        'string.uri': 'Invalid tracking URL format',
    }),
    estimatedDeliveryTime: Joi.number().min(0).messages({
        'number.min': 'Estimated delivery time must be a non-negative number',
    }),
});

// Validation function for delivery data
const validateDelivery = (data) => {
    return deliverySchemaValidation.validate(data);
};

// Exporting Mongoose model and Joi validation function
module.exports = {
    deliveryModel,
    validateDelivery,
};
