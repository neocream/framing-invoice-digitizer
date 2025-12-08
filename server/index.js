const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/api/invoices', [
],
    (req, res) => {
    const { name, amount, date } = req.body;
    return res.json({ data: name, amount, date })
})

app.get('/api/csv-export', (req, res) => {
  res.json({res: 'success'});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
