const express = require('express');
const router = express.Router();
const { executeCode } = require('../services/codeExecutor');

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, 'secretkey123');
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Compile and run code endpoint
router.post('/run', verifyToken, async (req, res) => {
    try {
        const { code, language, stdin } = req.body;
        
        if (!code || !code.trim()) {
            return res.status(400).json({ error: 'Please write some code first' });
        }
        
        if (!language) {
            return res.status(400).json({ error: 'Please select a language' });
        }

        console.log(`Compiling ${language} code for user ${req.userId}`);
        
        const result = await executeCode(code, language, stdin || '');
        res.json(result);
        
    } catch (error) {
        console.error('Compile route error:', error);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

module.exports = router;