const express = require('express');
const excelJs = require('exceljs');
const cors = require('cors');
const crypto = require('crypto');
var stringSimilarity = require("string-similarity");
const app = express();
const port = 3000;

app.use(express.json())
app.use(cors());

var invoices = [];
var hashedInvoices = [];
// create a list to check vendors against for standardization
const vendorList = [
  "Costco",
  "RONA",
  "Home Depot"
];

app.post('/api/invoices', (req, res) => {
  try {
    var {date, vendor, amount, status} = req.body;
    // standardize vendor
    vendor = stringSimilarity.findBestMatch(vendor, vendorList).bestMatch.target;
    console.log(stringSimilarity.findBestMatch(vendor, vendorList))

    // create a string from data to hash with by combining all properties, stripping spaces, and setting to uppercase
    const dataString = `${date}${vendor}${amount}`.toUpperCase().replace(/\s/g, "");
    const sha256 = crypto.createHash('sha256').update(dataString).digest('hex');

  } catch (err) {
    console.error("Something went wrong while parsing invoice data.");
    return res.status(500).json({error:"Invoice data could not be parsed."});
  }
  // check if hash already exists
  if(hashedInvoices.includes(sha256)) {
    return res.status(400).json({error:"Invoice already exists."});
  }
  // check amount value
  if(amount === "") {  
    return res.status(400).json({error:"Amount cannot be empty."});
  }
  if(isNaN(amount)) {
    return res.status(400).json({error:"Amount must be a number."});
  }

  hashedInvoices.push(sha256);
  invoices.push([date, vendor, amount, status]);
  return res.status(201).json({message:"success"});
})

app.get('/api/invoices', (req, res) => {
  return res.json(invoices);
})

app.get('/api/csv-export', async (req, res) => {
  if (invoices.length === 0) {
    return res.status(400).json({error: "No invoices added yet."})
  }
  // write to csv with excelJs
  try {
    const workbook = new excelJs.Workbook()
    const worksheet = workbook.addWorksheet('Receipts');

    worksheet.columns = [
      { header: 'Date', key: 'date'},
      { header: 'Vendor', key: 'vendor'},
      { header: 'Amount', key: 'amount'},
      { header: 'Status', key: 'status'},
    ];

    invoices.forEach(row => {
      worksheet.addRow(row);
    });

    const csvBuffer = await workbook.csv.writeBuffer();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="invoices.csv"');

    return res.send(csvBuffer);

  } catch (err) {
    return res.status(500).json({ error: "Exporting csv failed." });
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
