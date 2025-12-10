const express = require('express');
const excelJs = require('exceljs');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json())
app.use(cors());

var data = [];

app.post('/api/invoices', (req, res) => {
  const {date, vendor, amount, status} = req.body;
  if(amount === "") {  
    return res.status(400).json({error:"Amount cannot be empty."});
  }
  if(isNaN(amount)) {
    return res.status(400).json({error:"Amount must be a number."});
  }
  data.push([date, vendor, amount, status]);
  return res.status(201).json({message:"success"});
})

app.get('/api/invoices', (req, res) => {
  return res.json(data);
})

app.get('/api/csv-export', async (req, res) => {
  if (data.length === 0) {
    return res.status(400).json({error: "No receipts added yet."})
  }
  try {
    const workbook = new excelJs.Workbook()
    const worksheet = workbook.addWorksheet('Receipts');

    worksheet.columns = [
      { header: 'Date', key: 'date'},
      { header: 'Vendor', key: 'vendor'},
      { header: 'Amount', key: 'amount'},
      { header: 'Status', key: 'status'},
    ];

    data.forEach(row => {
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
