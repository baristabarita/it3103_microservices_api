//Order Service index file

const express = require('express');
const axios = require('axios');
const authenticateToken = require('./middlewares/authMiddleware');
const app = express();
const port = 3003;
const roleAccessMiddleware = require('./middlewares/roleAccessMiddleware')

app.use(express.json());
app.use(authenticateToken);

let orders = {};
let orderIdCounter = 1;

// Create a new order - Customer only
app.post('/orders', roleAccessMiddleware(['customer']), async (req, res) => {
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

// Get Order Details by ID - Admin only
app.get('/orders/:orderId', roleAccessMiddleware(['admin']), async (req, res) => {
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
app.get('/orders/all', roleAccessMiddleware(['admin']), async (req, res) =>{
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
app.put('/orders/:orderId', roleAccessMiddleware(['customer', 'admin']), async (req, res) => {
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

//Delete an Order - Open to all.
app.delete('/orders/:orderId', roleAccessMiddleware(['customer', 'admin']), async (req, res) => {
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


