const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');
const { ExpressPeerServer } = require('peer');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// ==================== FIXED SOCKET.IO CONFIGURATION ====================
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
    },
    allowEIO3: true,
    transports: ['polling', 'websocket'],
    pingTimeout: 60000,
    pingInterval: 25000
});

// CORS for HTTP requests
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());

// ==================== PEERJS FOR VIDEO ====================
const peerServer = ExpressPeerServer(server, { debug: true });
app.use('/peerjs', peerServer);

// Store active rooms for WebRTC signaling
const activeRooms = new Map();

// ==================== MODELS ====================
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    dateOfBirth: { type: String, default: '' },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
    role: { type: String, enum: ['candidate', 'interviewer', 'admin'], default: 'candidate' },
    institution: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    language: { type: String, default: 'python' },
    testCases: [{ input: String, output: String }],
    sampleInput: { type: String, default: '' },
    sampleOutput: { type: String, default: '' },
    constraints: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isApproved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const submissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    code: { type: String, required: true },
    language: { type: String, default: 'javascript' },
    score: { type: Number, default: 0 },
    aiScore: { type: Number, default: 0 },
    aiFeedback: { type: String, default: '' },
    aiDetailedFeedback: { type: Object, default: {} },
    timeComplexity: { type: String, default: '' },
    spaceComplexity: { type: String, default: '' },
    syntaxErrors: { type: String, default: '' },
    improvements: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now }
});

const interviewSchema = new mongoose.Schema({
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    interviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    status: { type: String, enum: ['scheduled', 'ongoing', 'completed', 'cancelled', 'flagged'], default: 'scheduled' },
    scheduledAt: { type: Date },
    startedAt: { type: Date },
    completedAt: { type: Date },
    roomId: { type: String, unique: true }
});

const violationSchema = new mongoose.Schema({
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['tab_switch', 'copy_paste', 'right_click', 'shortcut_key', 'face_not_detected', 'multiple_faces'], required: true },
    timestamp: { type: Date, default: Date.now },
    details: { type: String }
});

const User = mongoose.model('User', userSchema);
const Question = mongoose.model('Question', questionSchema);
const Submission = mongoose.model('Submission', submissionSchema);
const Interview = mongoose.model('Interview', interviewSchema);
const Violation = mongoose.model('Violation', violationSchema);

// ==================== FIXED SOCKET.IO EVENTS ====================
io.on('connection', (socket) => {
    console.log('✅ New client connected:', socket.id);
    
    // Register user in room
    socket.on('register-user', (data) => {
        const { userId, role, roomId } = data;
        socket.userId = userId;
        socket.role = role;
        socket.roomId = roomId;
        
        if (!activeRooms.has(roomId)) {
            activeRooms.set(roomId, { candidate: null, interviewer: null });
        }
        
        const room = activeRooms.get(roomId);
        if (role === 'candidate') room.candidate = socket.id;
        if (role === 'interviewer') room.interviewer = socket.id;
        
        socket.join(roomId);
        console.log(`📌 ${role} ${userId} registered in room ${roomId}`);
        
        // Notify the other user that someone joined
        socket.to(roomId).emit('user-joined', { 
            userId: socket.id, 
            role: role,
            message: `${role} has joined the interview`
        });
    });
    
    // Join interview room
    socket.on('join-interview-room', (roomId) => {
        socket.join(roomId);
        console.log(`🚪 User ${socket.id} joined room ${roomId}`);
        socket.to(roomId).emit('user-joined', { userId: socket.id, message: 'User joined' });
    });
    
    // WebRTC Signaling
    socket.on('webrtc-signal', (data) => {
        const { roomId, signal, type } = data;
        console.log(`📡 WebRTC signal from ${socket.id}: ${type}`);
        socket.to(roomId).emit('webrtc-signal', {
            signal: signal,
            from: socket.id,
            type: type
        });
    });
    
    // Live code update
    socket.on('code-update', (data) => {
        const { roomId, code, language } = data;
        console.log(`📝 Code update from ${socket.id} in room ${roomId}`);
        socket.to(roomId).emit('code-update', {
            code: code,
            language: language,
            userId: socket.id,
            timestamp: new Date()
        });
    });
    
    // Code sync for new joiners
    socket.on('request-code-sync', (data) => {
        const { roomId } = data;
        socket.to(roomId).emit('send-code-sync');
    });
    
    socket.on('code-sync-response', (data) => {
        const { roomId, code, language } = data;
        socket.to(roomId).emit('code-sync', { code, language });
    });
    
    // New question from interviewer
    socket.on('new-question', (data) => {
        const { roomId, question } = data;
        socket.to(roomId).emit('new-question', {
            question: question,
            timestamp: new Date().toISOString()
        });
    });
    
    // Tab switch warning
    socket.on('tab-warning', (data) => {
        const { roomId, count } = data;
        console.log(`⚠️ Tab warning from ${socket.id}: ${count}`);
        socket.to(roomId).emit('tab-warning', {
            message: `Candidate switched tabs ${count} times`,
            timestamp: new Date().toISOString()
        });
    });
    
    // Proctoring alert
    socket.on('proctoring-alert', (data) => {
        const { roomId, type, details } = data;
        socket.to(roomId).emit('proctoring-alert', {
            type: type,
            details: details,
            timestamp: new Date().toISOString()
        });
    });
    
    // End interview
    socket.on('end-interview', (roomId) => {
        console.log(`🏁 Interview ended in room ${roomId}`);
        io.to(roomId).emit('interview-ended', {
            message: 'Interview has been ended by the interviewer'
        });
        activeRooms.delete(roomId);
    });
    
    // Leave room
    socket.on('leave-room', (roomId) => {
        socket.leave(roomId);
        console.log(`👋 User ${socket.id} left room ${roomId}`);
        socket.to(roomId).emit('user-left', {
            userId: socket.id,
            message: 'A user has left the interview'
        });
    });
    
    socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
        for (const [roomId, room] of activeRooms.entries()) {
            if (room.candidate === socket.id || room.interviewer === socket.id) {
                io.to(roomId).emit('user-disconnected', {
                    userId: socket.id,
                    message: 'User disconnected'
                });
                activeRooms.delete(roomId);
                break;
            }
        }
    });
});

// ==================== AUTH MIDDLEWARE ====================
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
        const decoded = jwt.verify(token, 'secretkey123');
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

const verifyInterviewer = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
        const decoded = jwt.verify(token, 'secretkey123');
        if (decoded.role !== 'interviewer' && decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Only interviewers can do this' });
        }
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

const verifyAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
        const decoded = jwt.verify(token, 'secretkey123');
        if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// ==================== AUTH ROUTES ====================
app.post('/api/auth/register', async (req, res) => {
    try {
        const { 
            username, email, password, fullName, phone, address, city, state, pincode, 
            dateOfBirth, gender, role, institution 
        } = req.body;
        
        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) return res.status(400).json({ error: 'User already exists' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ 
            username, email, password: hashedPassword, fullName, phone, address, city, state, pincode,
            dateOfBirth, gender, role, institution
        });
        await user.save();
        
        const token = jwt.sign({ id: user._id, role: user.role }, 'secretkey123');
        res.json({ token, user: { id: user._id, username, email, role, fullName } });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
        
        const token = jwt.sign({ id: user._id, role: user.role }, 'secretkey123');
        res.json({ token, user: { id: user._id, username: user.username, email, role: user.role, fullName: user.fullName } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/auth/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.json(user);
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// ==================== ONLINE COMPILER (JDoodle API) ====================
async function executeCode(source_code, language, stdin = '') {
    try {
        const languageMap = {
            'javascript': 'nodejs',
            'python': 'python3',
            'java': 'java',
            'cpp': 'cpp17',
            'c': 'c',
            'csharp': 'csharp'
        };

        const jdoodleLang = languageMap[language] || 'nodejs';

        if (!process.env.JDOODLE_CLIENT_ID || !process.env.JDOODLE_CLIENT_SECRET) {
            return {
                success: true,
                output: `⚠️ JDoodle API Keys Missing\n\nYour code has been saved for review.`,
                error: null
            };
        }

        const response = await axios.post('https://api.jdoodle.com/v1/execute', {
            clientId: process.env.JDOODLE_CLIENT_ID,
            clientSecret: process.env.JDOODLE_CLIENT_SECRET,
            script: source_code,
            language: jdoodleLang,
            stdin: stdin,
            versionIndex: "0"
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
        });

        if (response.data.error) {
            return { success: false, error: `JDoodle Error: ${response.data.error}` };
        }

        return {
            success: true,
            output: response.data.output || '✅ Code executed successfully (no output)',
            error: response.data.error || '',
            memory: response.data.memory,
            cpuTime: response.data.cpuTime
        };

    } catch (error) {
        console.error('JDoodle execution error:', error.message);
        return { success: false, error: `Code execution failed: ${error.message}` };
    }
}

app.post('/api/compile/run', verifyToken, async (req, res) => {
    try {
        const { code, language, stdin } = req.body;
        
        if (!code || !code.trim()) {
            return res.status(400).json({ error: 'Please write some code first' });
        }
        
        if (!language) {
            return res.status(400).json({ error: 'Please select a language' });
        }

        const result = await executeCode(code, language, stdin || '');
        res.json(result);
        
    } catch (error) {
        console.error('Compile route error:', error);
        res.status(500).json({ error: 'Compilation failed. Please try again.' });
    }
});

// ==================== AI CODE EVALUATION ====================
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

async function evaluateCodeWithAI(code, question, language, expectedOutput = null) {
    if (!genAI) {
        return getEnhancedFallbackEvaluation();
    }
    
    const prompt = `You are an expert coding interviewer. Evaluate the following code solution thoroughly.

QUESTION:
Title: ${question.title || 'Coding Problem'}
Description: ${question.description || 'Write a solution'}
Difficulty: ${question.difficulty || 'medium'}
Expected Output: ${expectedOutput || 'N/A'}

CODE SUBMITTED:
Language: ${language}
Code:
${code}

Please provide a detailed evaluation in the following JSON format. Be honest and constructive:

{
    "score": (number 0-100, be strict but fair),
    "correctness": (string: "correct", "partial", or "incorrect"),
    "timeComplexity": (string: e.g., "O(n)", "O(n²)", "O(log n)"),
    "spaceComplexity": (string: e.g., "O(1)", "O(n)"),
    "syntaxErrors": (string: list any syntax errors or "None"),
    "logicErrors": (string: describe any logical issues),
    "codeQuality": (number: rate code readability and structure 0-100),
    "strengths": (string: what the candidate did well),
    "improvements": (string: specific suggestions to improve),
    "detailedFeedback": (string: comprehensive feedback for the candidate),
    "interviewerNotes": (string: notes for the interviewer about this solution)
}

Return ONLY valid JSON, no other text.`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        const response = result.response.text();
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const evaluation = JSON.parse(jsonMatch[0]);
            return {
                ...evaluation,
                score: Math.min(100, Math.max(0, evaluation.score || 75))
            };
        }
        return getEnhancedFallbackEvaluation();
    } catch (error) {
        console.error('AI evaluation failed:', error.message);
        return getEnhancedFallbackEvaluation();
    }
}

function getEnhancedFallbackEvaluation() {
    return {
        score: 75,
        correctness: "partial",
        timeComplexity: "Not analyzed",
        spaceComplexity: "Not analyzed",
        syntaxErrors: "None detected",
        logicErrors: "Unable to fully analyze",
        codeQuality: 70,
        strengths: "Code structure is acceptable",
        improvements: "Consider edge cases and optimization",
        detailedFeedback: "Your code has been submitted. The AI evaluation system is currently unavailable. An interviewer will review your solution manually.",
        interviewerNotes: "AI evaluation was unavailable. Please review manually."
    };
}

// AI Evaluation Endpoint
app.post('/api/evaluate/submission', verifyToken, async (req, res) => {
    try {
        const { code, questionId, language } = req.body;
        
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        
        const evaluation = await evaluateCodeWithAI(code, question, language);
        
        const submission = await Submission.findOneAndUpdate(
            { userId: req.userId, questionId: questionId },
            { 
                aiScore: evaluation.score,
                aiFeedback: evaluation.detailedFeedback || evaluation.feedback,
                aiDetailedFeedback: evaluation,
                timeComplexity: evaluation.timeComplexity,
                spaceComplexity: evaluation.spaceComplexity,
                syntaxErrors: evaluation.syntaxErrors,
                improvements: evaluation.improvements,
                score: evaluation.score
            },
            { new: true, upsert: true }
        );
        
        res.json({
            success: true,
            evaluation: evaluation,
            submissionId: submission._id
        });
        
    } catch (error) {
        console.error('Evaluation error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/submissions/:submissionId', verifyToken, async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.submissionId)
            .populate('questionId', 'title description difficulty');
        
        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }
        
        res.json(submission);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== PROCTORING ====================
app.post('/api/proctoring/violation', verifyToken, async (req, res) => {
    try {
        const { interviewId, type, details } = req.body;
        
        const violation = new Violation({
            interviewId,
            candidateId: req.userId,
            type,
            details
        });
        await violation.save();
        
        const violationCount = await Violation.countDocuments({ 
            interviewId, 
            candidateId: req.userId 
        });
        
        if (violationCount >= 3) {
            await Interview.findByIdAndUpdate(interviewId, { status: 'flagged' });
        }
        
        res.json({ success: true, violationCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/proctoring/violations/:interviewId', verifyToken, async (req, res) => {
    try {
        const violations = await Violation.find({ 
            interviewId: req.params.interviewId 
        }).sort({ timestamp: -1 });
        res.json(violations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== ADMIN ROUTES ====================
app.get('/api/admin/users', verifyAdmin, async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
});

app.get('/api/admin/stats', verifyAdmin, async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalCandidates = await User.countDocuments({ role: 'candidate' });
    const totalInterviewers = await User.countDocuments({ role: 'interviewer' });
    const totalQuestions = await Question.countDocuments();
    const approvedQuestions = await Question.countDocuments({ isApproved: true });
    const pendingQuestions = await Question.countDocuments({ isApproved: false });
    const totalSubmissions = await Submission.countDocuments();
    const totalViolations = await Violation.countDocuments();
    const averageScore = await Submission.aggregate([
        { $group: { _id: null, avg: { $avg: '$score' } } }
    ]);
    
    res.json({ 
        totalUsers, totalCandidates, totalInterviewers, 
        totalQuestions, approvedQuestions, pendingQuestions,
        totalSubmissions, totalViolations,
        averageScore: averageScore[0]?.avg || 0
    });
});

app.get('/api/admin/pending-questions', verifyAdmin, async (req, res) => {
    const pending = await Question.find({ isApproved: false }).populate('createdBy', 'username fullName');
    res.json(pending);
});

app.put('/api/admin/approve/:id', verifyAdmin, async (req, res) => {
    const question = await Question.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json(question);
});

app.delete('/api/admin/reject/:id', verifyAdmin, async (req, res) => {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rejected' });
});

// ==================== QUESTION ROUTES ====================
app.post('/api/questions/generate', verifyInterviewer, async (req, res) => {
    const { prompt } = req.body;
    res.json({
        title: prompt.substring(0, 40),
        description: `Write a solution for: ${prompt}`,
        difficulty: 'medium',
        language: 'python'
    });
});

app.post('/api/questions', verifyInterviewer, async (req, res) => {
    const question = new Question({ ...req.body, createdBy: req.userId, isApproved: false });
    await question.save();
    res.status(201).json({ message: 'Question submitted for approval' });
});

app.get('/api/questions', async (req, res) => {
    const questions = await Question.find({ isApproved: true });
    res.json(questions);
});

app.get('/api/questions/:id', async (req, res) => {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json(question);
});

app.get('/api/questions/my-questions', verifyInterviewer, async (req, res) => {
    try {
        const myQuestions = await Question.find({ createdBy: req.userId });
        res.json(myQuestions);
    } catch (err) {
        res.status(500).json([]);
    }
});

// ==================== SUBMISSION ROUTES ====================
app.post('/api/submissions', verifyToken, async (req, res) => {
    try {
        const { code, questionId, language } = req.body;
        
        let submission = await Submission.findOne({ userId: req.userId, questionId });
        
        if (submission) {
            submission.code = code;
            submission.language = language || submission.language;
            await submission.save();
        } else {
            submission = new Submission({ 
                userId: req.userId, 
                questionId, 
                code,
                language: language || 'javascript'
            });
            await submission.save();
        }
        
        res.json({ message: 'Submitted successfully', submission });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/submissions/my', verifyToken, async (req, res) => {
    try {
        const submissions = await Submission.find({ userId: req.userId })
            .populate('questionId', 'title difficulty')
            .sort({ submittedAt: -1 });
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== INTERVIEW ROUTES ====================
app.post('/api/interviews/start', verifyToken, async (req, res) => {
    try {
        const { questionId } = req.body;
        
        const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        let interview = await Interview.findOne({ candidateId: req.userId, questionId, status: 'ongoing' });
        
        if (!interview) {
            interview = new Interview({ 
                candidateId: req.userId, 
                questionId, 
                roomId,
                status: 'ongoing',
                startedAt: new Date()
            });
            await interview.save();
        }
        
        res.json({ interviewId: interview._id, roomId: interview.roomId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/interviews/end', verifyToken, async (req, res) => {
    try {
        const { interviewId } = req.body;
        await Interview.findByIdAndUpdate(interviewId, { 
            status: 'completed', 
            completedAt: new Date() 
        });
        res.json({ message: 'Interview completed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/interviews/active', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        let active;
        
        if (user.role === 'admin' || user.role === 'interviewer') {
            active = await Interview.find({ status: 'ongoing' })
                .populate('candidateId', 'username fullName')
                .populate('questionId', 'title');
        } else {
            active = await Interview.find({ candidateId: req.userId, status: 'ongoing' })
                .populate('questionId', 'title');
        }
        
        res.json(active);
    } catch (err) {
        res.status(500).json([]);
    }
});

app.get('/api/interviews/:interviewId', verifyToken, async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.interviewId)
            .populate('candidateId', 'username fullName email')
            .populate('questionId', 'title description difficulty');
        
        if (!interview) {
            return res.status(404).json({ error: 'Interview not found' });
        }
        
        res.json(interview);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== LEADERBOARD ====================
app.get('/api/submissions/leaderboard', verifyAdmin, async (req, res) => {
    try {
        const leaderboard = await Submission.aggregate([
            {
                $group: {
                    _id: '$userId',
                    averageScore: { $avg: '$score' },
                    totalSubmissions: { $sum: 1 },
                    bestScore: { $max: '$score' }
                }
            },
            { $sort: { averageScore: -1 } },
            { $limit: 10 }
        ]);
        
        await User.populate(leaderboard, { path: '_id', select: 'username fullName' });
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== START SERVER ====================
mongoose.connect('mongodb://localhost:27017/vcip')
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.log('❌ MongoDB error:', err));

server.listen(5000, () => console.log('🚀 Server running on port 5000'));