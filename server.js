// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res) => {
    const productId = products.find(p => p.id === req.params.id);
    if (productId) {//return the product if found
        res.json(productId);
    } else {//return 404 if product not found
        res.status(404).json({ message: 'Product not found' });
    }
});

// POST /api/products - Create a new product
app.post('/api/products', (req, res) => {
    const {name, 
      description, 
      price, 
      category, 
      
      inStock} = req.body;
    //Ensure all required fields are provided
    if (!name || !description || !price || !category) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    //Create a new product object
    const newProduct = {
        id: uuidv4(), // Create a unique ID
        name,
        description: description || '',
        price: Number(price), // Ensure price is a number
        category: category || 'uncategorized', // Default to 'uncategorized' if not provided
        inStock: inStock || false // Default to false if not provided
    };
    // Add the new product to the products array
    products.push(newProduct);
    res.status(201).json(newProduct); // Return the created product with 201 status
});

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {// If product not found, return 404
    return res.status(404).json({ error: 'Product not found' });
  }

  const updatedProduct = {// Create new product with updated values
    ...products[index],
    ...req.body,
    id: req.params.id // Prevent ID change
  };

  products[index] = updatedProduct;
  res.json(updatedProduct);
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res) => {
  const initialLength = products.length; // Store initial length for comparison
  products = products.filter(p => p.id !== req.params.id);// Filter products by ID
  
  if (products.length === initialLength) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.status(204).end(); // No content response
});

// TODO: Implement custom middleware for:
// - Request logging
// - Authentication
// - Error handling

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 