##  Test Queries

1. Authentication

# Missing API Key (401)
curl -X POST http://localhost:3000/api/products

# Valid Request
curl -X POST -H "x-api-key: YOUR_KEY" -H "Content-Type: application/json" -d '{"name":"Tablet","price":299}' http://localhost:3000/api/products

2. CRUD Operations

# GET all products
curl http://localhost:3000/api/products

# GET single product with id = 1
curl http://localhost:3000/api/products/1

# DELETE product with id = 3
curl -X DELETE -H "x-api-key: YOUR_KEY" http://localhost:3000/api/products/3

3. Advancerd Features

# Search (400 if no query)
curl http://localhost:3000/api/products/search?q=laptop

# Filtering
curl "http://localhost:3000/api/products?category=electronics&minPrice=100"