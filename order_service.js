//Order Service index file

const express = require('express');
const axios = require('axios');
const app = express();
const port = 3003;

app.use(express.json());

let orders = {};
let orderIdCounter = 1;

app.post('/orders', async (req, res) => {
    const { customerId, productId } = req.body;
    console.log(req.body);
    try {
        // Checks and verifies  if the customer exists
        const customerResponse = await axios.get(`http://localhost:3002/customers/${customerId}`);
        if (customerResponse.status !== 200) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        console.log(customerResponse);

        // Checks and verifies if the product exists
        const productResponse = await axios.get(`http://localhost:3001/products/${productId}`);
        if (productResponse.status !== 200) {
            return res.status(404).json({ error: 'Product not found' });
        }
        console.log(productResponse);

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

//Get Order Details
app.get('/orders/:orderId', (req, res) => {
    const orderId = parseInt(req.params.orderId);
    try {
        if (!orders[orderId]) {
            return res.status(404).json({ error: 'Order not found' });
        } else {
            res.json(orders[orderId]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching order details' });
    }
});

//Update Order Details
app.put('/orders/:orderId', async (req, res) => {
    const orderId = parseInt(req.params.orderId);
    try {
        if (!orders[orderId]) {
            res.status(404).send(`Order not found with ID ${orderId}`);
        } else {
            const { customerId, productId } = req.body;
            try {
            const customerResponse = await axios.get(`http://localhost:3002/customers/${customerId}`);
            if (customerResponse.status !== 200) {
                return res.status(404).json({ error: 'Customer not found' });
            }

            const productResponse = await axios.get(`http://localhost:3001/products/${productId}`);
            if (productResponse.status !== 200) {
                return res.status(404).json({ error: 'Product not found' });
            }
    
            orders[orderId].customerId = customerId;
            orders[orderId].productId = productId;
            res.send(`Order updated with ID ${orderId}`);
            } catch (error) {
            if (error.response && error.response.status === 404) {
                return res.status(404).json({ error: 'Customer or Product service error' });
            }
            res.status(500).json({ error: 'Error updating order' });
            }
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
          res.send(`Order deleted with ID ${orderId}`);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting order' });
    }
});

app.listen(port, () => 
    console.log(`Order Service running on Port http://localhost:${port}`)
);