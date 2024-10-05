//Product Service index file

const express = require('express');
const app = express();
const authenticateToken = require('./middlewares/authMiddleware');
const port = 3001;

app.use(express.json());
app.use(authenticateToken);

let products = {};
let productIdCounter = 1;

//Adds a new product.
app.post('/products', (req, res) =>{
    const productData = req.body;
    const productId = productIdCounter++;
    //Checks if products exists in Product service
    try{
        products[productId] = productData;
        res.status(201).json({
            message: 'Product added successfully', 
            productId: productId,
            product: products[productId]
        });
        console.log(products);
    }catch(error){
        res.status(500).json({error: 'Error adding product' });
    }

});

//Get product by ID.
app.get('/products/:productId', (req, res) => {
    const productId = req.params.productId;
    const product = products[productId];

    //Checks if specific product exists
    try{
        if(!product){
            return res.status(404).json({error: 'Product not found.'})
        }else{
            res.json(product);
        }
    }catch(error){
        res.status(500).json({error: 'Server Error fetching selected product'});
    }
});

//Updates an existing product.
app.put('/products/:productId', (req, res) => {
    const productId = req.params.productId;
    const product = products[productId];

    //Checks if the selected product exists
    try{
        if(!product){
            return res.status(404).json({error: 'Product not found.'})
        }else{
            Object.assign(product, req.body);
            res.json({message: 'Product updated successfully', product});
        }
    }catch(error){
        res.status(500).json({json: 'Server Error fetching selected Product'})
    }

    console.log(products);
});

//Deletes a product.

app.delete('/products/:productId', (req, res) => {
    const productId = req.params.productId;

    // Check if the product exists and delete it
    try {
        if (!products[productId]) {
            return res.status(404).json({ error: 'Product not found.' });
        } else {
            delete products[productId]; // Remove the product from the object
            res.status(200).json({ message: 'Product deleted successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product' });
    }
});

app.listen(port, () => 
    console.log(`Product Service running on http://localhost:${port}`)
);