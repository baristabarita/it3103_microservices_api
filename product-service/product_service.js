//Product Service index file

const express = require('express');
const app = express();
const port = 3001;
const authenticateToken = require('../middlewares/authMiddleware');
const roleAccessMiddleware = require('../middlewares/roleAccessMiddleware');

app.use(express.json());
// app.use(authenticateToken);

let products = {
    1: { id: 1, name: 'Product 1', description: 'Description 1', price: 10 },
    2: { id: 2, name: 'Product 2', description: 'Description 2', price: 20 },
    3: { id: 3, name: 'Product 3', description: 'Description 3', price: 30 }
}
let productIdCounter = 4;

//Adds a new product - Admins only.
app.post('/products/addProduct', authenticateToken, roleAccessMiddleware(['admin']), async (req, res) =>{
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

//Get product by ID - Open to all.
app.get('/products/:productId',  authenticateToken, roleAccessMiddleware(['customer', 'admin']), async (req, res) => {
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

//Get and view all available products - Open to all.
app.get('/products/allProduct/view', authenticateToken, roleAccessMiddleware(['customer', 'admin']), async (req, res) => {
    try {
        // Log to debug products
        console.log('All Products:', products);
        
        const allProducts = Object.values(products);

        if (allProducts.length === 0) {
            console.log('No products found'); // Log for debugging
            return res.status(404).json({
                message: 'No products found'
            });
        } else {
            console.log('Products Retrieved Successfully:', allProducts); // Log for debugging
            return res.status(200).json({
                message: 'Products Retrieved Successfully',
                products: allProducts
            });
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

//Updates an existing product - Admin only.

app.put('/products/:productId',  authenticateToken, roleAccessMiddleware(['admin']), async (req, res) => {
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

//Deletes a product - Admin only.

app.delete('/products/:productId',  authenticateToken, roleAccessMiddleware(['admin']), async (req, res) => {
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