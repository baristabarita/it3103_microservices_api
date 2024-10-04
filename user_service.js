//user Service index file

const express = require('express');
const app = express();
const port = 3002;

app.use(express.json());

let users = [];
let userIdCounter = 1;

//Add New user
app.post('/users', (req, res) => {

    const newuser = req.body;
    newuser.id = userIdCounter++;
    
    try {
        users.push(newuser);
        res.status(201).json(newuser);
    } catch (error) {
        res.status(500).json({error: "Error adding new user"});
    }

    console.log(users);

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
 