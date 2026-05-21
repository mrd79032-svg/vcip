const express = require('express');
const Interview = require('../models/Interview');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/start', auth, async (req, res) => {
    try {
        const { questionId } = req.body;
        let interview = await Interview.findOne({ candidateId: req.user.id, questionId });
        if (!interview) {
            interview = new Interview({ candidateId: req.user.id, questionId });
            await interview.save();
        }
        res.json({ interviewId: interview._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/active', auth, async (req, res) => {
    if (req.user.role !== 'interviewer' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    const active = await Interview.find({ status: 'ongoing' })
        .populate('candidateId', 'username fullName')
        .populate('questionId', 'title');
    res.json(active);
});

module.exports = router;