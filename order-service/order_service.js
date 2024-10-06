//Order Service index file

const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const PORT = 3003;
const authenticateToken = require('../middlewares/authMiddleware');
const roleAccessMiddleware = require('../middlewares/roleAccessMiddleware')
const { inputValidation, ordersValidationRules, editOrdersValidationRules } = require('../middlewares/sanitizeMiddleware');
const rateLimitMiddleware = require('../middlewares/rateLimiterMiddleware');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
}

app.use(express.json());
// app.use(authenticateToken);

let orders = {};
let orderIdCounter = 1;

const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false // Accept self-signed certificates
    })
});

// Create a new order - Customer only
app.post('/addOrder', authenticateToken, roleAccessMiddleware(['customer']), inputValidation(ordersValidationRules), rateLimitMiddleware, async (req, res) => {
    const { userId, productId } = req.body;
    console.log(req.body);

    try {
        // Checks and verifies if the user exists
        const userResponse = await axiosInstance.get(`https://localhost:3000/users/${userId}`, {
            headers: {
                Authorization: req.headers['authorization'],  // Pass the original token
            }
        });
        if (userResponse.status !== 200) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userDetails = userResponse.data;
        console.log(userResponse);

        // Checks and verifies if the product exists
        const productResponse = await axiosInstance.get(`https://localhost:3000/products/view/${productId}`, {
            headers: {
                Authorization: req.headers['authorization'],  // Pass the original token
            }
        });
        if (productResponse.status !== 200) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const productDetails = productResponse.data;
        console.log(productResponse);

        // If both user and product are valid, proceed to create the order
        const orderId = orderIdCounter++;
        const order = { id: orderId, userId, productId, userDetails, productDetails };

        // Stores the created order
        orders[orderId] = order;

        return res.status(201).json({
            message: 'Order created successfully',
            orderId: orderId,
            order: orders[orderId]
        });

    } catch (error) {
        console.error('Error creating order:', error);
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'User or Product service error' });
        }
        return res.status(500).json({ error: 'Error creating order' });
    }
});

// Get Order Details by ID - Admin only
app.get('/:orderId', authenticateToken, roleAccessMiddleware(['admin']), rateLimitMiddleware, async (req, res) => {
    const orderId = parseInt(req.params.orderId);
    try {
        if (!orders[orderId]) {
            return res.status(404).json({ error: 'Order not found' });
        } else {
            const order = orders[orderId];
            // Get full details of user and product
            const userDetails = order.userDetails;
            const productDetails = order.productDetails;
            res.json({
                ...order,
                userDetails,
                productDetails
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching order details' });
    }
});

// Get ALL Orders - Admin only.
app.get('/allOrders/view', authenticateToken, roleAccessMiddleware(['admin']), rateLimitMiddleware, async (req, res) =>{
    const allOrders = Object.values(orders);

    try{
        if(allOrders.length === 0){
            return res.status(404).json({
                error: 'No orders found'
            });
        } else {
            const detailedOrders = allOrders.map (order => ({
                ...order,
                userDetails: order.userDetails,
                productDetails: order.productDetails

            }));
            
            res.json({
                message: 'All orders retrieved successfully',
                orders: detailedOrders
            })

        }
    } catch(error){
        res.status(500).json({error: 'Error retrieving orders'});
    }
});

// Update Order Details -  Open to all.
app.put('/:orderId', authenticateToken, roleAccessMiddleware(['customer', 'admin']), inputValidation(editOrdersValidationRules), rateLimitMiddleware, async (req, res) => {
    const orderId = parseInt(req.params.orderId);

    try {
        if (!orders[orderId]) {
            return res.status(404).json({ error: `Order not found with ID ${orderId}` });
        }

        const { userId, productId } = req.body;

        // Check and verify if the new user exists
        const userResponse = await axiosInstance.get(`https://localhost:3000/users/${userId}`, {
            headers: {
                Authorization: req.headers['authorization'], // Pass the original token
            }
        });
        if (userResponse.status !== 200) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userDetails = userResponse.data;

        // Check and verify if the new product exists
        const productResponse = await axiosInstance.get(`https://localhost:3000/products/view/${productId}`, {
            headers: {
                Authorization: req.headers['authorization'], // Pass the original token
            }
        });
        if (productResponse.status !== 200) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const productDetails = productResponse.data;

        // Update order details
        orders[orderId].userId = userId;
        orders[orderId].productId = productId;
        orders[orderId].userDetails = userDetails;
        orders[orderId].productDetails = productDetails;

        return res.json({
            message: `Order updated with ID ${orderId}`,
            order: orders[orderId]
        });

    } catch (error) {
        console.error('Error updating order:', error);
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'User or Product service error' });
        }
        return res.status(500).json({ error: 'Error updating order' });
    }
});

//Delete an Order - Admin only.
app.delete('/:orderId', authenticateToken, roleAccessMiddleware(['admin']), rateLimitMiddleware, async (req, res) => {
    const orderId = parseInt(req.params.orderId);
    
    try {
        if (!orders[orderId]) {
          res.status(404).send(`Order not found with ID ${orderId}`);
        } else {
          delete orders[orderId];
          res.json({message: `Order deleted with ID ${orderId}`});
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting order' });
    }
});

// app.listen(port, () => 
//     console.log(`Order Service running on Port http://localhost:${port}`)
// );


//Start Server HTTPS
https.createServer(options, app).listen(PORT, () => {
    console.log(`Order service running on port ${PORT}`);
});