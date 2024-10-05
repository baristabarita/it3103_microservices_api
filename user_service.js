//user Service index file

const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 3002;

app.use(express.json());

let users = [];
let userIdCounter = 1;

function generateToken(user) {
    const payload = {
        id: user.id,
        user: user.name,
        email: user.email,
        role: user.role,
        pass: user.pass
    }
    console.log(payload);
    return jwt.sign(payload, 'secret', { expiresIn: '1h' });
}

//Add New user, Also known as Signups
app.post('/signup', (req, res) => {

    const { name, email, role, pass } = req.body;
    console.log(`Name of the user: ${name}`);
    console.log(`Email of the user: ${email}`);
    console.log(`Password of the user: ${pass}`);

    const newUser = {
        id: userIdCounter++,
        name,
        email,
        role,
        pass
    };
    
    try {
        users.push(newUser);
        const token = generateToken(newUser);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({error: "Error adding new user"});
        console.log(error);
    }

    // console.log(users);

});

//Login User
app.post('/login', (req, res) => {
    
    const { email, pass } = req.body;
    const incomingUser = users.find(u => u.email === email && u.pass === pass); //find the user information

    // console.log(incomingUser);
    
    try {
        if (incomingUser) {
            const token = generateToken(incomingUser);
            res.json({ token });
        } else {
            res.status(401).json({
                error: 'Invalid credentials'
            });
        }
    } catch (error) {
        res.status(500).json({error: "There was a problem during login!"});
    }


});
 
//Get user Detail
app.get('/users/:userID', (req, res) => {
    const userID = parseInt(req.params.userID);
    const user = users.find((user) => user.id === userID);

    try {
        if (!user) {
            return res.status(404).json({message: 'user not found'});
        } else {
            res.json(user);
        }
    } catch (error) {
        res.status(500).json({error: "There was an error in finding the user"});
    }

});
 
//Update user Information
app.put('/users/:userID', (req, res) => {
    const userID = parseInt(req.params.userID);
    const user = users.find((user) => user.id === userID);

    try {
        if (!user) {
            return res.status(404).json({ message: 'user not found'});
        } else {
            Object.assign(user, req.body);
            res.json(user);
        }
    } catch (error) {
        res.status(500).json({error: "Error adding new user"});
    }

    console.log(users);
 

});
 
//Delete user Information
app.delete('/users/:userID', (req, res) => {
    const userID = parseInt(req.params.userID, 10);
    const ndex = users.findIndex((user) => user.id === userID);

    try {
        if (ndex === -1) {
            return res.status(404).json({ message: 'user not found'});
        } else {
            users.splice(ndex, 1);
            res.json({
                message: `user with ID ${userID} has been deleted`
            });
        }
    } catch (error) {
        res.status(500).json({error: "Error adding new user"});
    }


});
 
//Start Server
app.listen(port, () => {
    console.log(`User Service now listening at http://localhost:${port}`);
});
 