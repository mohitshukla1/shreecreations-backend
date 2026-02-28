const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      brand: {
        type: String,
        required: true,
      },
      manufacturer: {
        type: String,
        required: true,
      },
      upc: {
        type: String,
      },
      sellingPrice: {
        type: Number,
        required: true,
      },
      costPrice: {
        type: Number,
        required: true,
      },
      stock: {
        type: Number,
        required: true,
      },
      gst: {
        type: Number,
      },
      margin: {
        type: Number,
        required: true,
      },
      sellingPrice: {
        type: Number,
        required: true,
      },
      itmeCode:{
        type:String,
        required: true,
      },
      size:{
        type:String,
        required: true,
      }
});

inventorySchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
