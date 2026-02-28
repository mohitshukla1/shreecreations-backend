const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String
});

customerSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
