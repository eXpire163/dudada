const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Import UUID package

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// File path for the users JSON file
const usersFilePath = path.join(__dirname, 'users.json');

// Function to load users from the JSON file
const loadUsers = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
};

// Function to save users to the JSON file
const saveUsers = (users) => {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error saving users file:', error);
    }
};

// WebSocket Server
const wss = new WebSocketServer({ noServer: true });
const broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(JSON.stringify(data));
        }
    });
};

// API Endpoints
app.post('/add-user', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).send({ error: "Invalid input" });

    const users = loadUsers(); // Load the current list of users
    const id = uuidv4(); // Generate a new UUID
    users.push({ id, name, active: false });

    saveUsers(users); // Save the updated user list
    res.status(201).send({ message: "User added", users });
    broadcast({ type: 'update', users });
});

app.delete('/remove-user/:id', (req, res) => {
    const { id } = req.params;
    let users = loadUsers(); // Load the current list of users
    users = users.filter(user => user.id !== id);

    saveUsers(users); // Save the updated user list
    res.send({ message: "User removed", users });
    broadcast({ type: 'update', users });
});

app.put('/toggle-user/:id', (req, res) => {
    const { id } = req.params;
    const users = loadUsers(); // Load the current list of users
    const user = users.find(u => u.id === id);

    if (user) {
        user.active = !user.active;
        saveUsers(users); // Save the updated user list
        res.send({ message: "User toggled", user });
    } else {
        res.status(404).send({ error: "User not found" });
    }
    broadcast({ type: 'update', users });
});

app.get('/users', (req, res) => {
    const users = loadUsers(); // Load the current list of users
    res.send(users);
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// WebSocket Upgrade Handling
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});