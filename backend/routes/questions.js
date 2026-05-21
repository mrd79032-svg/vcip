const express = require('express');
const Question = require('../models/Question');
const auth = require('../middleware/auth');
const router = express.Router();

// ONLY INTERVIEWERS AND ADMIN can generate questions
router.post('/generate', auth, async (req, res) => {
    if (req.user.role !== 'interviewer' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only interviewers can generate questions' });
    }
    // rest of your code
});

// ONLY INTERVIEWERS AND ADMIN can create questions
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'interviewer' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only interviewers can create questions' });
    }
    // rest of your code
});

// Public - anyone can view approved questions
router.get('/', async (req, res) => {
    const questions = await Question.find({ isApproved: true });
    res.json(questions);
});

module.exports = router;