const Item = require("../models/Item");
const Inventory = require("../models/Inventory");
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const currentDate = new Date();
    

const createInventory = async (req, res) => {
   
  const {      name,
    brand,
    manufacturer,
    upc,
    sellingPrice,
    costPrice,
    gst,
    margin,
    stock,itmeCode,size } = req.body;
    
   
  const inventory = new Inventory({
    name,
    brand,
    manufacturer,
    upc,
    sellingPrice,
    costPrice,
    gst,
    margin,
    stock,
    itmeCode,size
  });
  const savedInventory = await inventory.save();

  res.status(201).json(savedInventory);
};

const getInventory = async(req, res)=>{
  let term = req.query.term;
  let inventory = [];
  if(term){
    //  inventory = await Inventory.find({name:term});
     inventory = await Inventory.find({ itmeCode: { $regex: new RegExp(term, 'i') } },{id:1,name:1, itmeCode:1, sellingPrice:1,costPrice:1, margin:1});
     console.log("inventoryinventory",inventory)

  }else{
     inventory = await Inventory.find({}).sort({ createdAt: -1 });;

  }

  
  res.json(inventory);
}

const serchInventory = async(req, res)=>{
  const searchString = req.params.searchString;
  const item = await Inventory.findById({name:searchString},{name:1, sellingPrice:1, costPrice:1, margin:1});

  res.json(item);
};


const searchItemCode  = async (req, res) => {
  try {
    const { itemCode } = req.body;

    if (!itemCode) {
      return res.status(400).json({ error: 'Item code is required.' });
    }
    let inventoryItem = {};
    let inventoryData = await Inventory.findOne({ itmeCode: itemCode });
    if(inventoryData){
      inventoryItem = inventoryData;
    }
    

    res.json(inventoryItem);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getInventoryDetails = async(req, res)=>{
  const id = req.params.id;
  const item = await Inventory.findById(id);
  // console.log("itemitemitem",item)
  res.json(item);
};



function generateInvoiceNumber() {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');

  const uniqueIdentifier = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

  const invoiceNumber = `${month}${day}-${uniqueIdentifier}`;
  return invoiceNumber;
}


const updateInventory = async (req, res) => {
  const {name,
    brand,
    manufacturer,
    upc,
    sellingPrice,
    costPrice,
    gst,
    margin,
    stock,
    itmeCode,size } = req.body;
  const id = req.params.id;
  const item = {
    name,
    brand,
    manufacturer,
    upc,
    sellingPrice,
    costPrice,
    gst,
    margin,
    stock,
    itmeCode,size
  };
  const updatedItem = await Inventory.findByIdAndUpdate(id, item, { new: true });
  console.log("updatedItem",updatedItem)
  res.json(updatedItem);
};

const deleteInventory = async (req, res) => {
  const id = req.params.id;

  await Inventory.findByIdAndRemove(id);

  res.status(204).end();
};


module.exports = {
    createInventory,
    getInventory,
    serchInventory,
    getInventoryDetails,
    updateInventory,
    deleteInventory,
    searchItemCode
};
