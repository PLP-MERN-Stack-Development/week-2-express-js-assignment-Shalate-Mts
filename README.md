# Express.js Product API - Assignment 2

## Project Description
A RESTful API built with Express.js implementing full CRUD operations for product management, featuring authentication, advanced querying, and comprehensive error handling.

##File Structure
.
├── server.js                     # Main application
├── .env                          # Environment template
├── package.json                  # Dependencies
├── package-lock.json     
├── README.md                     # This file
├── Week2-Assignment.md           # Assignment instructions
└── /postman_tests                # Test files
    ├── wk2.postman_collection
    └── test_queries.md           # Example queries

## Features
- **CRUD Operations**: Create, read, update, and delete products
- **Authentication**: API key protection for write operations
- **Search & Filter**: `/search?q=term` and `?category=electronics`
- **Pagination**: `?page=1&limit=5`
- **Error Handling**: Custom errors for 400, 401, 404 responses

## Installation
1. Clone repository:
   git clone https://github.com/[your-username]/[repo-name].git
   cd [repo-name]

2. Install dependencies:
   npm install

3. Configure environment:
   - cp .env.example .env
   - Edit .env with your credentials:
      - API_KEY="your_secret_key_here"
      - PORT=3000

4. Start Server:
   - node server.js
   - nodemon server.js (to restart programme automatically after  changes made)
   **Server runs at "http://localhost:3000"

## API Reference
1. Base URL: http://localhost:3000/api
2. Endpoints: 
   - GET	=> /products	
         => /products/:id	
         => /products/search	
   - POST => /products	
   - PUT	 => /products/:id	
   - DELETE	=> /products/:id	

## Testing
1. Manual Testing:
   - Use provided Postman collection in /tests folder
   - Test all endpoints with valid/invalid inputs

2. Automated Verification:
   - curl -I http://localhost:3000/api/products

## Verification Checklist
   - All endpoints respond with correct status codes
   - Authentication blocks unauthorized requests
   - Search returns relevant results
   - Error handling provides clear messages

##License
This project is part of the PLP Express.js Product API Assignment (Educational Use)