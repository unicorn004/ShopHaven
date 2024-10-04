const mongoose = require('mongoose');
const Joi = require('joi');

// Admin schema (Mongoose)
const adminSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, required: true, enum: ['admin', 'superadmin'] }, // Role should be either 'admin' or 'superadmin'
    },
    { timestamps: true }
);

// Mongoose model
const adminModel = mongoose.model('Admin', adminSchema);

// Joi schema for validation with regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // Minimum 6 characters, at least one letter and one number
const roleRegex = /^(admin|superadmin)$/; // Role can only be 'admin' or 'superadmin'

const adminSchemaValidation = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().pattern(emailRegex).required().messages({
        'string.pattern.base': 'Invalid email format',
    }),
    password: Joi.string().pattern(passwordRegex).required().messages({
        'string.pattern.base': 'Password must be at least 6 characters long, with at least one letter and one number',
    }),
    role: Joi.string().pattern(roleRegex).required().messages({
        'string.pattern.base': 'Role must be either "admin" or "superadmin"',
    }),
});

// Validation function for admin data
const validateAdmin = (data) => {
    return adminSchemaValidation.validate(data);
};

// Exporting Mongoose model and Joi validation function
module.exports = {
    adminModel,
    validateAdmin,
};
