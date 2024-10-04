//Order Service index file

const express = require('express');
const axios = require('axios');
const app = express();
const port = 3003;

app.use(express.json());

let orders = {};
let orderIdCounter = 1;

// Create a new order
app.post('/orders', async (req, res) => {
    const { userId, productId } = req.body;
    console.log(req.body);

    try {
        // Checks and verifies if the user exists
        const userResponse = await axios.get(`http://localhost:3002/users/${userId}`);
        if (userResponse.status !== 200) {
            return res.status(404).json({ error: 'user not found' });
        }
        const userDetails = userResponse.data;
        console.log(userResponse);

        // Checks and verifies if the product exists
        const productResponse = await axios.get(`http://localhost:3001/products/${productId}`);
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
        res.status(201).json({
            message: 'Order created successfully',
            orderId: orderId,
            order: orders[orderId]
        });

    } catch (error) {
        if (error.response || error.response.status === 404) {
            return res.status(404).json({ error: 'user or Product service error' });
        }
        res.status(500).json({ error: 'Error creating order' });
    }
});

// Get Order Details
app.get('/orders/:orderId', (req, res) => {
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

// Update Order Details
app.put('/orders/:orderId', async (req, res) => {
    const orderId = parseInt(req.params.orderId);
    try {
        if (!orders[orderId]) {
            return res.status(404).json({ error: `Order not found with ID ${orderId}` });
        }

        const { userId, productId } = req.body;

        try {
            // Check and verify if the new user exists
            const userResponse = await axios.get(`http://localhost:3002/users/${userId}`);
            if (userResponse.status !== 200) {
                return res.status(404).json({ error: 'user not found' });
            }
            const userDetails = userResponse.data;

            // Check and verify if the new product exists
            const productResponse = await axios.get(`http://localhost:3001/products/${productId}`);
            if (productResponse.status !== 200) {
                return res.status(404).json({ error: 'Product not found' });
            }
            const productDetails = productResponse.data;

            // Update order details
            orders[orderId].userId = userId;
            orders[orderId].productId = productId;
            orders[orderId].userDetails = userDetails;
            orders[orderId].productDetails = productDetails;

            res.json({
                message: `Order updated with ID ${orderId}`,
                order: orders[orderId]
            });

        } catch (error) {
            if (error.response && error.response.status === 404) {
                return res.status(404).json({ error: 'user or Product service error' });
            }
            res.status(500).json({ error: 'Error updating order' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating order' });
    }
});

//Delete an Order
app.delete('/orders/:orderId', (req, res) => {
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

app.listen(port, () => 
    console.log(`Order Service running on Port http://localhost:${port}`)
);