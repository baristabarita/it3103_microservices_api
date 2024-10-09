const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.GATEWAY_PORT || 3000;

// Simple test route to verify gateway running
app.get('/test', (req, res) => {
  console.log('Received request on /test');
  res.send('API Gateway is running');
});

// Proxy options for microservices
const productServiceProxy = createProxyMiddleware({
    target: 'https://localhost:3001', // URL of the product service
    changeOrigin: true,
    secure: false,
});

const userServiceProxy = createProxyMiddleware({
    target: 'https://localhost:3002', // URL of the user service
    changeOrigin: true,
    secure: false,
});

const orderServiceProxy = createProxyMiddleware({
    target: 'https://localhost:3003', // URL of the order service
    changeOrigin: true,
    secure: false,
});

// Proxy middleware to forward requests to user service for testing
app.use('/products',productServiceProxy); // All /products routes go to product service
app.use('/orders', orderServiceProxy); // All /orders routes go to order service
app.use('/users', userServiceProxy); // All /users routes go to user service

// HTTPS options
const options = {
    key: fs.readFileSync(path.resolve(__dirname, 'ssl/server.key')),
    cert: fs.readFileSync(path.resolve(__dirname, 'ssl/server.cert'))
};
  
// Start HTTPS server
https.createServer(options, app).listen(PORT, () => {
    try {
        console.log(`API Gateway running securely on https://localhost:${PORT}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return res.status(400).json({error: "Error occured."});
    }
});