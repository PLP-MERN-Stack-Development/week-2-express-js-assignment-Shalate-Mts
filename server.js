// server.js - Starter Express server for Week 2 assignment
require('dotenv').config(); // Loads environment variables
//console.log('API Key:', process.env.API_KEY); // Debug line

// Error classes for better handling
class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message);
    this.statusCode = 404;
  }
}
// Validation middleware
const validateProduct = (req, res, next) => {
  const { name, price } = req.body;
  
  if (!name?.trim()) {
    return res.status(400).json({ message: 'Product name is required' });
  }

  if (!price || isNaN(price)) {
    return res.status(400).json({ message: 'Valid price (number) is required' });
  }

  next();
};
// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

//Request logger
const requestLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next(); // Pass control to the next middleware
};
app.use(requestLogger);

const authRequest = (req, res, next) => {
  //Extract credentials from request
  const apiKey = req.headers['x-api-key']; // Use req.get to access headers
  
  // Debug logs (check terminal after request)
/**  console.log('------ AUTH DEBUG ------');
  console.log('Received Key:', apiKey || 'NOT FOUND');
  console.log('Expected Key:', process.env.API_KEY);
**/
  if (!apiKey) {   //Validate credentials
    return res.status(401).json({ error: 'API key missing' });
  }

  if (apiKey !== process.env.API_KEY) { //Compare with stored key
    return res.status(403).json({ error: 'Invalid API key' });
  }
  next(); //Proceed to route handler if authenticated
};

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
// Simple version of the GET /api/products endpoint
app.get('/api/products', (req, res) => {
  //Get all products
  let filteredProducts = [...products]; // Start with a copy of all products

  //Filter by category (if provided)
  if (req.query.category) {
    filteredProducts = filteredProducts.filter(
      product => product.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }

  //Search by name (if provided)
  if (req.query.search) {
    filteredProducts = filteredProducts.filter(
      product => product.name.toLowerCase().includes(req.query.search.toLowerCase())
    );
  }

  //Switch between pages
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default 10 items per page
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  //Send the response
  res.json({
    success: true,
    totalProducts: filteredProducts.length,
    currentPage: page,
    productsPerPage: limit,
    products: paginatedProducts
  });
});

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res, next) => {
   const product = products.find(p => p.id === req.params.id);
  if (!product) return next(new NotFoundError());//error handling if product not found
  res.json(product);
});

// POST /api/products - Create a new product
app.post('/api/products', 
  authRequest,       // Authorise use
  validateProduct,   // Then validation
  (req, res) => {
    try {
      const { name, description, price, category, inStock } = req.body;

      const newProduct = {
        id: uuidv4(),
        name: name.trim(),
        description: description?.trim() || '',
        price: Number(price),
        category: category?.trim() || 'uncategorized',
        inStock: Boolean(inStock)
      };

      products.push(newProduct);
      res.status(201).json(newProduct);

    } catch (err) {
      next(err); // Check error handling middleware
    }
  }
);

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', 
  authRequest,        // Authentication first
  validateProduct,    
  (req, res, next) => {
    try {
      const productId = req.params.id;
      const index = products.findIndex(p => p.id === productId);

      if (index === -1) {
        throw new NotFoundError('Product not found'); // Custom error
      }

      const updatedProduct = {
        ...products[index],
        ...req.body,
        // Ensure critical fields aren't accidentally overwritten
        id: productId,
        price: Number(req.body.price) || products[index].price
      };

      // Validate category exists if provided
      if (req.body.category && !req.body.category.trim()) {
        throw new ValidationError('Category cannot be empty');
      }

      products[index] = updatedProduct;
      res.json(updatedProduct);

    } catch (err) {
      next(err); // Pass to global error handler
    }
  }
);

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', authRequest, (req, res) => {
  const initialLength = products.length; // Store initial length for comparison
  products = products.filter(p => p.id !== req.params.id);// Filter products by ID
  
  if (products.length === initialLength) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.status(204).end(); // No content response
});

// Middleware for handling 404 errors
app.use((err, req, res, next) => {
  console.error(err.stack); // Log for debugging
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({ 
    error: { 
      message, 
      status: statusCode 
    } 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 