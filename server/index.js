const express = require('express');
const { body, validationResult } = require("express-validator"); 
const app = express();
const port = 3000;
app.use(express.json())

var data = []

app.post('/api/invoices', 
  (req, res) => {
    if(req.body.amount === "") {
      return res.status(400).json({error:"Amount cannot be empty."});
    }
    if(isNaN(req.body.amount)) {
      return res.status(400).json({error:"Amount must be a number."});
    }
    const {amount, date, vendor, status} = req.body;
    data.push({amount, date, vendor, status});
    return res.status(201).json({message:"success"});
})

app.get('/api/csv-export', (req, res) => {
  if (data.length < 0) {
    return res.status(400).json({error: "No receipts added yet."})
  }
  res.json({message: data});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
