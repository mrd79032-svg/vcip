const express = require('express');
const Question = require('../models/Question');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// All admin routes require authentication and admin role
router.use(auth);
router.use((req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
});

// Get pending questions
router.get('/pending-questions', async (req, res) => {
    try {
        const pending = await Question.find({ isApproved: false })
            .populate('createdBy', 'username fullName email')
            .sort({ createdAt: -1 });
        res.json(pending);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Approve question
router.put('/approve/:id', async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        );
        if (!question) return res.status(404).json({ error: 'Question not found' });
        res.json({ message: 'Question approved successfully', question });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reject/Delete question
router.delete('/reject/:id', async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        if (!question) return res.status(404).json({ error: 'Question not found' });
        res.json({ message: 'Question rejected and removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get statistics
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCandidates = await User.countDocuments({ role: 'candidate' });
        const totalInterviewers = await User.countDocuments({ role: 'interviewer' });
        const totalQuestions = await Question.countDocuments();
        const approvedQuestions = await Question.countDocuments({ isApproved: true });
        const pendingQuestions = await Question.countDocuments({ isApproved: false });
        
        res.json({
            totalUsers,
            totalCandidates,
            totalInterviewers,
            totalQuestions,
            approvedQuestions,
            pendingQuestions
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;const express = require('express');
const Question = require('../models/Question');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// All admin routes require authentication and admin role
router.use(auth);
router.use((req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
});

// Get pending questions
router.get('/pending-questions', async (req, res) => {
    try {
        const pending = await Question.find({ isApproved: false })
            .populate('createdBy', 'username fullName email')
            .sort({ createdAt: -1 });
        res.json(pending);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Approve question
router.put('/approve/:id', async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        );
        if (!question) return res.status(404).json({ error: 'Question not found' });
        res.json({ message: 'Question approved successfully', question });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reject/Delete question
router.delete('/reject/:id', async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        if (!question) return res.status(404).json({ error: 'Question not found' });
        res.json({ message: 'Question rejected and removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get statistics
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCandidates = await User.countDocuments({ role: 'candidate' });
        const totalInterviewers = await User.countDocuments({ role: 'interviewer' });
        const totalQuestions = await Question.countDocuments();
        const approvedQuestions = await Question.countDocuments({ isApproved: true });
        const pendingQuestions = await Question.countDocuments({ isApproved: false });
        
        res.json({
            totalUsers,
            totalCandidates,
            totalInterviewers,
            totalQuestions,
            approvedQuestions,
            pendingQuestions
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;