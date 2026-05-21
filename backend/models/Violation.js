const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['tab_switch', 'copy_paste', 'right_click', 'shortcut_key', 'face_not_detected', 'multiple_faces'], required: true },
    timestamp: { type: Date, default: Date.now },
    details: { type: String }
});

module.exports = mongoose.model('Violation', violationSchema);