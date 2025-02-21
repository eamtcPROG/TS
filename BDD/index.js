const express = require('express');
const app = express();

app.use(express.json());

let products = []; 

// Endpoint to create a new product
app.post('/products', (req, res) => {
  const product = { id: Date.now(), ...req.body };
  products.push(product);
  res.status(201).json(product);
});

// Endpoint to retrieve a product by ID
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

module.exports = app;
