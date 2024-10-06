//user Service index file

const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const PORT = 3002;
const authenticateToken = require('../middlewares/authMiddleware');
const roleAccessMiddleware = require('../middlewares/roleAccessMiddleware');
const { inputValidation, regValidationRules, logValidationRules } = require('../middlewares/sanitizeMiddleware');
const rateLimitMiddleware = require('../middlewares/rateLimiterMiddleware');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
}

// // HTTPS options
// const options = {
//     key: fs.readFileSync(path.resolve(__dirname, '../ssl/server.key')),
//     cert: fs.readFileSync(path.resolve(__dirname, '../ssl/server.cert'))
// };

app.use(express.json());

let users = [];
let userIdCounter = 1;


function generateToken(user) {
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };
    console.log('Generated Token Payload:', payload);
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

// Registers a new user
app.post('/register', inputValidation(regValidationRules), rateLimitMiddleware, async (req, res) => {
    const { name, email, role, pass } = req.body;
    const hashedPassword = await bcrypt.hash(pass, 10);
    const newUser = {
        id: userIdCounter++,
        name,
        email,
        role,
        pass: hashedPassword
    };

    try {
        users.push(newUser);
        console.log('New User Registered:', newUser);
        const token = generateToken(newUser);
        res.status(201).json({ user: newUser, token });
    } catch (error) {
        console.error('Error Adding New User:', error);
        res.status(500).json({ error: "Error adding new user" });
    }
});

// Login for User
app.post('/login', inputValidation(logValidationRules), rateLimitMiddleware, async (req, res) => {
    const { email, pass } = req.body;
    const incomingUser = users.find(u => u.email === email); 

    try {
        if (incomingUser && await bcrypt.compare(pass, incomingUser.pass)) {
            const token = generateToken(incomingUser);
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({error: "There was a problem during login!"});
    }
});

//Add New user - Admin only
app.post('/addUser',  authenticateToken, roleAccessMiddleware(['admin']), rateLimitMiddleware, async (req, res) => {
    const newuser = req.body;
    newuser.id = userIdCounter++;
    
    try {
        users.push(newuser);
        res.status(201).json(newuser);
    } catch (error) {
        res.status(500).json({error: "Error adding new customer"});
    }
    console.log(users);
});

//Get specific user Detail - open to all
app.get('/:userID',  authenticateToken, roleAccessMiddleware(['customer', 'admin']), rateLimitMiddleware, (req, res) => {
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
 
//Update user Information - All users
app.put('/:userID',  authenticateToken, roleAccessMiddleware(['customer', 'admin']), rateLimitMiddleware, (req, res) => {
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
 
//Delete user Information - admin only
app.delete('/:userID',  authenticateToken, roleAccessMiddleware(['admin']), rateLimitMiddleware, (req, res) => {
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
 
// //Start Server
// app.listen(port, () => {
//     console.log(`User Service now listening at http://localhost:${port}`);
// });


//Start Server HTTPS
https.createServer(options, app).listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
});