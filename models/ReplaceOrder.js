const mongoose = require('mongoose');

// Define the order schema
const replaceOrderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
    },
  customerName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  saleOrderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  items: [{
    itemName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    code:{
      type: String
    },
  }],
  subTotal: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  discountedTotal: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
   
  },
  taxAmount: {
    type: Number,
  
  },
  total: {
    type: Number,
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
  },
  invoiceDate: {
    type: String,
    required: true,
  },
  paymentMode:{
    type: String
  }
}, { timestamps: true });

// Create the Order model
const replaceOrder = mongoose.model('Order', replaceOrderSchema);

module.exports = replaceOrder;