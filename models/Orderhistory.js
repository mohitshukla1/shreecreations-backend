const mongoose = require('mongoose');

// Define the order schema
const OrderhistorySchema = new mongoose.Schema({
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
      type: String,
      ref: "Inventory"
    },
    discount: {
      type: Number,
      
    }
  }],
  subTotal: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
   
  },
  discountedTotal: {
    type: Number,
   
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
  },
  return:{
    type: Boolean
  },
  notes:{
    type: String
  },
  finalPayment:{
    type: Number,
  },
  remaining:{
    type: Number,
  },
  returnItems: [{
    itemName: {
      type: String,
      
    },
    quantity: {
      type: Number,
      
    },
    rate: {
      type: Number,
      
    },
    price: {
      type: Number,
     
    },
    code:{
      type: String,
      ref: "Inventory"
    },
    discount: {
      type: Number,
      
    }
  }],
  
}, { timestamps: true });

// Create the Order model
const Orderhistory = mongoose.model('Orderhistory', OrderhistorySchema);

module.exports = Orderhistory;