const mongoose = require('mongoose');
const Joi = require('joi');

// Payment schema (Mongoose)
const paymentSchema = new mongoose.Schema({
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    signature: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
  }, { timestamps: true });

// Mongoose model
const paymentModel = mongoose.model('Payment', paymentSchema);

// Exporting Mongoose model and Joi validation function
module.exports = {paymentModel};
