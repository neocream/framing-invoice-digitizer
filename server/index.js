const express = require('express');
const { body, validationResult } = require("express-validator"); 
const app = express();
const port = 3000;
app.use(express.json())

var data = []

app.post('/api/invoices', 
  (req, res) => {
    // handle errors
    if(req.body.amount === "") {
      return res.status(400).json({error:"Amount cannot be empty."});
    }
    
    if(isNaN(req.body.amount)) {
      return res.status(400).json({error:"Amount must be a number."});
    }

    return res.status(201).json({message:"success"});
    
})

app.get('/api/csv-export', (req, res) => {
  res.json({res: 'success'});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
