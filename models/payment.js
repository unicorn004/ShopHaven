const mongoose = require('mongoose');
const Joi = require('joi');

// Payment schema (Mongoose)
const paymentSchema = mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order', // Refers to the order collection
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0, // Ensures amount is non-negative
        },
        method: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        transactionId: {
            type: String,
            unique: true,
            required: true,
        },
    },
    { timestamps: true }
);

// Mongoose model
const paymentModel = mongoose.model('Payment', paymentSchema);

// Joi schema for validation
const paymentSchemaValidation = Joi.object({
    order: Joi.string().hex().length(24).required().messages({
        'string.length': 'Invalid order ID format',
        'any.required': 'Order ID is required',
    }),
    amount: Joi.number().min(0).required().messages({
        'number.min': 'Amount must be a non-negative number',
        'any.required': 'Amount is required',
    }),
    method: Joi.string().required(),
    status: Joi.string().required(),
    transactionId: Joi.string().required(),
});

// Validation function for payment data
const validatePayment = (data) => {
    return paymentSchemaValidation.validate(data);
};

// Exporting Mongoose model and Joi validation function
module.exports = {
    paymentModel,
    validatePayment,
};
