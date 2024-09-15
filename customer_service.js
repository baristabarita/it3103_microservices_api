//Customer Service index file

const express = require('express');
const app = express();
const port = 3002;

app.use(express.json());

let customers = [];
let customerIdCounter = 1;

//Add New Customer
app.post('/customers', (req, res) => {
    const newCustomer = req.body;
    newCustomer.id = customerIdCounter+1;
    customers.push(newCustomer);
    res.status(201).json(newCustomer);
});
 
//Get Customer Detail
app.get('/customers/:customerID', (req, res) => {
    const customerID = parseInt(req.params.customerID, 10);
    const customer = customers.find(c => c.id === customerID);

    if (!customer) {
        return res.status(404).json({
            message: 'Customer not found'
        });
    }

    res.json(customer);
});
 
//Update Customer Information
app.put('/customers/:customersID', (req, res) => {
    const customerID = parseInt(req.params.customerID, 10);
    const updatedCustomer = req.body;
    const customerIndex = customers.findIndex(c => c.id === customerID);

    if (customerIndex === -1) {
        return res.status(404).json({
            message: 'Customer not found'
        });
    }

    customers[customerIndex] = updatedCustomer;
    res.json(updatedCustomer);
});
 
//Delete Customer Information
app.delete('/customers/:customersID', (req, res) => {
    const customerID = parseInt(req.params.customerID, 10);
    const customerIndex = customers.findIndex(c => c.id === customerID);

    if (customerIndex === -1) {
        return res.status(404).json({
            message: 'Customer not found'
        });
    }

    customers.splice(customerIndex, 1);
    res.status(204).end();
});
 
//Start Server
app.listen(port, () => {
    console.log(`Customer Service, listening at http://localhost:${port}`);
});
 