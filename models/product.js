const mongoose = require('mongoose');
const Joi = require('joi');

// Product schema (Mongoose)
const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3, // Name should have at least 3 characters
        },
        price: {
            type: Number,
            required: true,
            min: 0, // Price must be a non-negative value
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category', // Refers to the category collection
            required: true,
        },
        stock: {
            type: Number,
            default: true, // Defaults to true indicating in-stock
        },
        description: {
            type: String,
            minlength: 5, // Minimum description length of 5 characters
        },
        image: {
            type: Buffer,
            required: true,
        },
    },
    { timestamps: true }
);

// Mongoose model
const productModel = mongoose.model('Product', productSchema);

// Joi schema for validation
const productSchemaValidation = Joi.object({
    name: Joi.string().min(3).required().messages({
        'string.min': 'Name must be at least 3 characters long',
        'any.required': 'Product name is required',
    }),
    price: Joi.number().min(0).required().messages({
        'number.min': 'Price must be a non-negative value',
        'any.required': 'Product price is required',
    }),
    category: Joi.string().min(3).max(50).required().messages({
        'string.length': 'Invalid category ID format',
        'any.required': 'Category is required',
    }),
    stock: Joi.number().required().messages({
        'boolean.base': 'Stock status must be true or false',
    }),
    description: Joi.string().optional(),
    image: Joi.string().optional().messages({
        'any.required': 'Product image is required',
    }),
});

// Validation function for product data
const validateProduct = (data) => {
    return productSchemaValidation.validate(data);
};

// Exporting Mongoose model and Joi validation function
module.exports = {
    productModel,
    validateProduct,
};
