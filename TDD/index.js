const express = require('express');
const app = express();

app.use(express.json());

let users = []; // In-memory users array

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to my Express app!' });
});

app.post('/users', (req, res) => {
  const user = { id: Date.now(), ...req.body };
  users.push(user);
  res.status(201).json(user);
});

// New endpoint: GET /users returns all users
app.get('/users', (req, res) => {
  res.status(200).json(users);
});

// New endpoint: GET /users/:id returns a specific user
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// New endpoint: PUT /users/:id updates an existing user
app.put('/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id == req.params.id);
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    res.status(200).json(users[index]);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

module.exports = app;
