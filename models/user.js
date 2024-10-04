const mongoose = require('mongoose');
const Joi = require('joi');

// Address sub-schema (Mongoose)
const AddressSchema = mongoose.Schema({
    state: { type: String, required: true },
    zip: { type: Number, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
});

// User schema (Mongoose)
const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: false },
        phone: { type: Number, required: false },
        addresses: [AddressSchema], // Array of addresses using the Address sub-schema
    },
    { timestamps: true }
);

// Mongoose model
const userModel = mongoose.model('User', userSchema);

// Joi schema for validation with regex
const addressSchema = Joi.object({
    state: Joi.string().min(2).max(50).required(),
    zip: Joi.number().integer().min(10000).max(999999).required(),
    city: Joi.string().min(2).max(50).required(),
    address: Joi.string().min(5).max(100).required(),
});

// Regex patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // Minimum 6 characters, at least one letter and one number
const phoneRegex = /^[0-9]{10}$/; // Matches exactly 10 digits

const userSchemaValidation = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().pattern(emailRegex).required().messages({
        'string.pattern.base': 'Invalid email format',
    }),
    password: Joi.string().pattern(passwordRegex).messages({
        'string.pattern.base': 'Password must be at least 6 characters long, with at least one letter and one number',
    }),
    phone: Joi.string().pattern(phoneRegex).messages({
        'string.pattern.base': 'Phone number must be exactly 10 digits',
    }),
    addresses: Joi.array().items(addressSchema).min(1).required(), // At least one address required
});

// Validation function for user data
const validateUser = (data) => {
    return userSchemaValidation.validate(data);
};

// Exporting Mongoose model and Joi validation function
module.exports = {
    userModel,
    validateUser,
};
