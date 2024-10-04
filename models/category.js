const mongoose = require('mongoose');
const Joi = require('joi');

// Category schema (Mongoose)
const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true, // Ensures category name is unique
            trim: true,   // Removes leading/trailing whitespace
            minlength: 3, // Category name must be at least 3 characters long
            maxlength: 50 // Category name should not exceed 50 characters
        },
    },
    { timestamps: true }
);

// Mongoose model
const categoryModel = mongoose.model('Category', categorySchema);

// Joi schema for validation
const categorySchemaValidation = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.min': 'Category name must be at least 3 characters long',
        'string.max': 'Category name must not exceed 50 characters',
        'any.required': 'Category name is required',
    }),
});

// Validation function for category data
const validateCategory = (data) => {
    return categorySchemaValidation.validate(data);
};

// Exporting Mongoose model and Joi validation function
module.exports = {
    categoryModel,
    validateCategory,
};
