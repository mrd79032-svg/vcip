const express = require('express');
const Submission = require('../models/Submission');
const Question = require('../models/Question');
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', auth, async (req, res) => {
    try {
        const { code, questionId } = req.body;
        const question = await Question.findById(questionId);
        if (!question) return res.status(404).json({ error: 'Question not found' });
        
        let aiFeedback = '';
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
            const reviewPrompt = `Review this code for problem: ${question.title}. Code: ${code}. Give feedback on correctness, time complexity, space complexity, code quality.`;
            const result = await model.generateContent(reviewPrompt);
            aiFeedback = result.response.text();
        } catch (err) {
            aiFeedback = 'AI review temporarily unavailable.';
        }
        
        const submission = new Submission({ userId: req.user.id, questionId, code, feedback: aiFeedback });
        await submission.save();
        res.json({ message: 'Code submitted successfully', submission, aiReview: aiFeedback });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/my', auth, async (req, res) => {
    const submissions = await Submission.find({ userId: req.user.id }).populate('questionId', 'title difficulty');
    res.json(submissions);
});

module.exports = router;