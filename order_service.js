//Order Service index file

const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;

app.use(express.json());

let orders = {};
let orderIdCounter = 1;

app.post('/orders', async (req, res) => {
    const { customerId, productId } = req.body;

    try {
        // Checks and verifies  if the customer exists
        const customerResponse = await axios.get(`http://localhost:3002/customers/${customerId}`);
        if (customerResponse.status !== 200) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Checks and verifies if the product exists
        const productResponse = await axios.get(`http://localhost:3001/products/${productId}`);
        if (productResponse.status !== 200) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // If both customer and product are valid, proceed to create the order
        const orderId = orderIdCounter++;
        const order = { id: orderId, customerId, productId };

        // Stores the created order
        orders[orderId] = order;
        res.status(201).json({
            message: 'Order created successfully',
            orderId: orderId,
            order: orders[orderId]
        });

    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'Customer or Product service error' });
        }
        res.status(500).json({ error: 'Error creating order' });
    }
});

app.listen(port, () => 
    console.log('Order Service running on Port 3003')
);