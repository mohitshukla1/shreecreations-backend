const Customer = require("../models/Customer");
const Order = require("../models/Order");

const getCustomers = async (_req, res) => {
  //   const orderList = await Order.find({});
  //   let allcustomers = [];
  //   await Promise.all(
  //     orderList.map(async (order) => {
  //       const customerInfo = await Customer.findOne({ phoneNumber: order.phoneNumber });
  //       if (!customerInfo) {
  //         const customer = new Customer({
  //           name: order.customerName,
  //           phoneNumber: order.phoneNumber
  //         });
  //         const savedCustomer = await customer.save();
  //         allcustomers.push(savedCustomer);
  //         console.log("CCCCCCCCCCCCCCCCCCCCCCC Adderd", order.phoneNumber);
  //       } else {
  //         console.log("customerInfo000000000", customerInfo.phoneNumber);
  //         console.log("CCCCCCCCCCCCCCCCCCCCCCC found");
  //       }
  //     })
  //   );
  //   const customerList = await Customer.find({});
  //   let allCusList = JSON.parse(JSON.stringify(customerList));
  //   await Promise.all(
  //     allCusList.map(async (customer) => {
  //       const orderList = await Order.find({ phoneNumber: customer.phoneNumber });
  //       let orderAmount = 0;
  //       for (let x = 0; x < orderList.length; x++) {
  //         orderAmount = orderAmount + orderList[x].total;
  //       }
  //       customer["orderAmount"] = orderAmount;
  //     })
  //   );
  //   res.json(allCusList);
};

// res.json(allcustomers);

module.exports = {
  getCustomers
};
