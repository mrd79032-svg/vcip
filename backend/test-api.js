const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/auth/login', (req, res) => {
    console.log('Login request received:', req.body);
    res.json({ message: 'Login successful', token: 'test-token', user: { email: req.body.email } });
});

app.post('/api/auth/register', (req, res) => {
    console.log('Register request received:', req.body);
    res.json({ message: 'Registration successful', token: 'test-token', user: { email: req.body.email } });
});

app.listen(5000, () => console.log('Test server running on port 5000'));