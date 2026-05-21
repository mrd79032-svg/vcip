const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
    startedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interview', interviewSchema);