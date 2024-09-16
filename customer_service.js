//Customer Service index file

const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

let customers = [];
let customerIdCounter = 1;

//Add New Customer
app.post('/customers', (req, res) => {

    const newCustomer = req.body;
    newCustomer.id = customerIdCounter++;
    
    try {
        customers.push(newCustomer);
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({error: "Error adding new customer"});
    }

    console.log(customers);

});
 
//Get Customer Detail
app.get('/customers/:customerID', (req, res) => {
    const customerID = parseInt(req.params.customerID);
    const customer = customers.find((customer) => customer.id === customerID);

    try {
        if (!customer) {
            return res.status(404).json({message: 'Customer not found'});
        } else {
            res.json(customer);
        }
    } catch (error) {
        res.status(500).json({error: "There was an error in finding the user"});
    }

});
 
//Update Customer Information
app.put('/customers/:customerID', (req, res) => {
    const customerID = parseInt(req.params.customerID);
    const customer = customers.find((customer) => customer.id === customerID);

    try {
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found'});
        } else {
            Object.assign(customer, req.body);
            res.json(customer);
        }
    } catch (error) {
        res.status(500).json({error: "Error adding new customer"});
    }

    console.log(customers);
 

});
 
//Delete Customer Information
app.delete('/customers/:customerID', (req, res) => {
    const customerID = parseInt(req.params.customerID, 10);
    const ndex = customers.findIndex((customer) => customer.id === customerID);

    try {
        if (ndex === -1) {
            return res.status(404).json({ message: 'Customer not found'});
        } else {
            customers.splice(ndex, 1);
            res.json({
                message: `Customer with ID ${customerID} has been deleted`
            });
        }
    } catch (error) {
        res.status(500).json({error: "Error adding new customer"});
    }


});
 
//Start Server
app.listen(port, () => {
    console.log(`Customer Service, listening at http://localhost:${port}`);
});
 