const Inventory = require("../models/Inventory");
const Item = require("../models/Item");
const Order = require("../models/Order");
const Orderhistory = require("../models/Orderhistory");
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const saleReport = async (req, res) => {
  try {
    // Get the current date

    let dates = [
      {
        month: "May 2025",
        endDate: "2025-05-31",
        startDate: "2025-05-01"
      },
      {
        month: "APR 2025",
        endDate: "2025-04-31",
        startDate: "2025-04-01"
      },
      {
        month: "MAR 2025",
        endDate: "2025-03-31",
        startDate: "2025-03-01"
      },
      {
        month: "Feb 2025",
        endDate: "2025-02-28",
        startDate: "2025-02-01"
      },
      {
        month: "Jan 2025",
        endDate: "2025-01-31",
        startDate: "2025-01-01"
      },
      {
        month: "Dec 2024",
        endDate: "2024-12-31",
        startDate: "2024-12-01"
      },
      {
        month: "Nov 2024",
        endDate: "2024-11-30",
        startDate: "2024-11-01"
      },
      {
        month: "Apr 2024",
        endDate: "2024-01-31",
        startDate: "2024-01-01"
      },
      {
        month: "Feb 2024",
        endDate: "2024-02-28",
        startDate: "2024-02-01"
      },
      {
        month: "March 2024",
        endDate: "2024-03-31",
        startDate: "2024-03-01"
      },
      {
        month: "Oct 2024",
        endDate: "2024-10-31",
        startDate: "2024-10-01"
      },
      {
        month: "Sep 2024",
        endDate: "2024-09-30",
        startDate: "2024-09-01"
      },
      {
        month: "Aug 2024",
        endDate: "2024-08-31",
        startDate: "2024-08-01"
      },
      {
        month: "July 2024",
        endDate: "2024-07-31",
        startDate: "2024-07-01"
      },
      {
        month: "Jun 2024",
        endDate: "2024-06-30",
        startDate: "2024-06-01"
      },
      {
        month: "May 2024",
        endDate: "2024-05-31",
        startDate: "2024-05-01"
      },
      {
        month: "Apr 2024",
        endDate: "2024-04-30",
        startDate: "2024-04-01"
      }
    ];
    let stats = [];
    for (let x = 0; x < dates.length; x++) {
      // const { startDate, endDate } = req.body;

      startDate = dates[x].startDate;
      endDate = dates[x].endDate;
      const startOfMonth = new Date(startDate);
      const endOfMonth = new Date(endDate);

      if (isNaN(startOfMonth) || isNaN(endOfMonth)) {
        return res.status(400).json({ error: "Invalid date format." });
      }

      // Fetch orders for the current month
      const orders = await Order.find({
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth
        }
      }).sort({ createdAt: -1 });

      // Initialize variables to calculate total sales and profit
      let totalOrders = orders.length;
      let totalSalesAmount = 0;
      let totalProfit = 0;

      // Iterate through each order
      for (const order of orders) {
        console.log("order.total", order.total);

        if (!order.return) {
          totalSalesAmount += order.total;
        }
        if (order.oldOrderId) {
          totalSalesAmount = totalSalesAmount - Number(order.advance);
        }

        // Calculate profit for each order
        let orderCost = 0;

        if (order.oldOrderId) {
          for (const item of order.returnItems) {
            const inventoryItem = await Inventory.findOne({ itmeCode: item.code });
            if (inventoryItem) {
              orderCost += inventoryItem.costPrice * item.quantity;
            }
          }
          totalProfit += order.total - orderCost;
        } else {
          for (const item of order.items) {
            const inventoryItem = await Inventory.findOne({ itmeCode: item.code });
            if (inventoryItem) {
              orderCost += inventoryItem.costPrice * item.quantity;
            }
          }
          totalProfit += order.total - orderCost;
        }
      }
      let profitPercentage = 0;
      if (totalSalesAmount > 0) {
        profitPercentage = (totalProfit / totalSalesAmount) * 100;
      }
      // Prepare the stats object
      stats.push({
        month: dates[x].month,
        totalOrders,
        saleAmount: totalSalesAmount,
        profit: totalProfit,
        profitPercentage: Number(profitPercentage.toFixed(2))
      });
    }
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const returnOrder = async (req, res) => {
  // const {   customerName,
  //   phoneNumber,
  //   saleOrderNumber,
  //   items,
  //   subTotal,
  //   discount,
  //   discountedTotal,
  //   tax,
  //   taxAmount,
  //   total,paymentMode,
  //   notes, finalPayment,
  //  } = req.body;
  const {
    items,
    returnItemsId,
    saleOrderNumber,
    invoiceNumber,
    subTotal,
    discount,
    discountedTotal,
    tax,
    taxAmount,
    total,
    paymentMode,
    notes,
    finalPayment,
    advance
  } = req.body;
  let orderHistoryId = "";
  console.log("$$$$$$$$$$$$$$$$$$$$$$", invoiceNumber);
  let oldOrder = await Order.findOne({ invoiceNumber });

  if (oldOrder) {
    let orderHistory = JSON.parse(JSON.stringify(oldOrder));
    delete orderHistory._id;
    console.log("oldOrder", orderHistory);
    const orderHistoryInfo = new Orderhistory(orderHistory);
    orderHistoryId = await orderHistoryInfo.save();

    let returnItems = [];
    let allNewitems = [];
    orderHistory.items.map((item) => {
      if (returnItemsId.includes(item._id)) {
        returnItems.push({
          itemName: item.itemName,
          quantity: 1,
          rate: item.rate,
          price: item.price / item.quantity,
          code: item.code,
          discount: item.discount
        });
      } else {
        // allNewitems.push({
        //   itemName:item.itemName ,
        //   quantity:1 ,
        //   rate: item.rate ,
        //   price: item.price,
        //   code:item.code ,
        //   discount: item.discount
        // })
      }
    });

    console.log("returnItems", returnItems);
    await Promise.all(
      items.map(async (item) => {
        let inventoryInfo = await Inventory.findOne({ _id: item.itemName }, { name: 1, itmeCode: 1 });
        item.itemName = inventoryInfo.name;
        item.code = inventoryInfo.itmeCode;
        allNewitems.push(item);
      })
    );
    const invoiceNumber = generateInvoiceNumber();
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, "0");
    const monthIndex = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const invoiceDate = `${day} ${months[monthIndex]} ${year}`;
    const order = new Order({
      customerName: oldOrder.customerName,
      phoneNumber: oldOrder.phoneNumber,
      saleOrderNumber,
      items: allNewitems,
      subTotal,
      discount,
      discountedTotal,
      tax,
      taxAmount,
      total,
      invoiceNumber,
      invoiceDate,
      paymentMode,
      notes,
      finalPayment,
      oldOrderId: oldOrder.invoiceNumber,
      advance,
      returnItems
    });
    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  }

  // const order = new Order({
  //   customerName,
  //   phoneNumber,
  //   saleOrderNumber,
  //   items:allNewitems,
  //   subTotal,
  //   discount,
  //   discountedTotal,
  //   tax,
  //   taxAmount,
  //   total,
  //   invoiceNumber,
  //   invoiceDate,
  //   paymentMode,
  //   notes,
  //   finalPayment
  // });
  // const savedOrder = await order.save();

  // res.status(201).json(savedOrder);
};

const normalOrder = async (req, res) => {
  const {
    customerName,
    phoneNumber,
    saleOrderNumber,
    items,
    subTotal,
    discount,
    discountedTotal,
    tax,
    taxAmount,
    total,
    paymentMode
  } = req.body;
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0");
  const monthIndex = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const invoiceDate = `${day} ${months[monthIndex]} ${year}`;

  // Example usage
  const invoiceNumber = generateInvoiceNumber();
  const order = new Order({
    customerName,
    phoneNumber,
    saleOrderNumber,
    items: items,
    subTotal,
    discount,
    discountedTotal,
    tax,
    taxAmount,
    total,
    invoiceNumber,
    invoiceDate
  });
  const savedOrder = await order.save();

  res.status(201).json(savedOrder);
};
const createOrder = async (req, res) => {
  const {
    customerName,
    phoneNumber,
    saleOrderNumber,
    items,
    subTotal,
    discount,
    discountedTotal,
    tax,
    taxAmount,
    total,
    paymentMode,
    notes,
    finalPayment
  } = req.body;

  let allNewitems = [];
  await Promise.all(
    items.map(async (item) => {
      let inventoryInfo = await Inventory.findOne({ _id: item.itemName }, { name: 1, itmeCode: 1 });
      item.itemName = inventoryInfo.name;
      item.code = inventoryInfo.itmeCode;
      allNewitems.push(item);
    })
  );
  const currentDate = new Date();

  const day = currentDate.getDate().toString().padStart(2, "0");
  const monthIndex = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const invoiceDate = `${day} ${months[monthIndex]} ${year}`;

  // Example usage
  const invoiceNumber = generateInvoiceNumber();
  const order = new Order({
    customerName,
    phoneNumber,
    saleOrderNumber,
    items: allNewitems,
    subTotal,
    discount,
    discountedTotal,
    tax,
    taxAmount,
    total,
    invoiceNumber,
    invoiceDate,
    paymentMode,
    notes,
    finalPayment
  });
  const savedOrder = await order.save();

  res.status(201).json(savedOrder);
};

const getOrders = async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });

  res.json(orders);
};

// const getOrders = async(req, res)=>{

//   let orders = await Order.aggregate([
//   {
//     $unwind: "$items" // Deconstruct the items array
//   },
//   {
//     $lookup: {
//       from: "inventories", // Target collection
//       localField: "items.code", // Field from Order collection
//       foreignField: "itmeCode", // Field from Inventory collection
//       as: "inventory" // Output array field
//     }
//   },
//   {
//     $unwind: "$inventory" // Deconstruct the inventory array
//   },
//   {
//     $project: {
//       customerName: 1,
//       phoneNumber: 1,
//       saleOrderNumber: 1,
//       "inventory.costPrice": 1 // Include only costPrice from inventory
//     }
//   }
// ])

//   res.json(orders);

// }

const orderCount = async (req, res) => {
  const orders = await Order.countDocuments({});

  res.json({ total: orders });
};

const getOrderInfo = async (req, res) => {
  const id = req.params.id;
  const item = await Order.findById(id);

  res.json(item);
};

function generateInvoiceNumber() {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");

  const uniqueIdentifier = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  const invoiceNumber = `${month}${day}-${uniqueIdentifier}`;
  return invoiceNumber;
}

const searchOrder = async (req, res) => {
  try {
    const { invoiceId, phoneNumber, name, selectedMonth } = req.body;

    let orderList = [];
    if (name && name != "") {
      orderList = await Order.find({ customerName: { $regex: new RegExp(name, "i") } }).sort({ createdAt: -1 });
    }
    if (phoneNumber && phoneNumber != "") {
      orderList = await Order.find({ phoneNumber }).sort({ createdAt: -1 });
    }
    if (invoiceId && invoiceId != "") {
      orderList = await Order.find({ invoiceNumber: invoiceId });
    }

    if (selectedMonth) {
      orderList = await Order.aggregate([
        {
          $addFields: {
            month: { $month: { date: "$createdAt" } }
          }
        },
        {
          $match: {
            month: Number(selectedMonth)
          }
        },
        {
          $project: {
            createdAt: 1,
            customerName: 1,
            phoneNumber: 1,
            saleOrderNumber: 1,
            items: 1,
            subTotal: 1,
            discount: 1,
            discountedTotal: 1,
            tax: 1,
            taxAmount: 1,
            total: 1,
            invoiceNumber: 1,
            invoiceDate: 1,
            paymentMode: 1,
            return: 1,
            notes: 1,
            profit: {
              $subtract: ["$total", { $sum: "$items.price" }] // Adjust this based on your profit calculation logic
            }
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ]);
    }

    res.json(orderList);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderInfo,
  searchOrder,
  normalOrder,
  orderCount,
  returnOrder,
  saleReport
};
