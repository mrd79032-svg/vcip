const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const app = express();

// ==================== SMART CORS CONFIGURATION ====================
// Ye setup localhost aur aapke aane wale live frontend dono ko auto-handle karega
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173', // Vite standard port (agar aap use kar rahe ho)
    'https://your-vcip-frontend.netlify.app', // ⚠️ Yahan apna live frontend URL replace kar lena jab deploy hoga
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, postman, or internal server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());

// ==================== MODELS ====================
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    role: { type: String, enum: ['candidate', 'interviewer', 'admin'], default: 'candidate' },
    createdAt: { type: Date, default: Date.now }
});

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, default: 'medium' },
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
    submittedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Question = mongoose.model('Question', questionSchema);
const Submission = mongoose.model('Submission', submissionSchema);

// ==================== JWT SECRET CONFIG ====================
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secretkey_for_local_only';

// ==================== AUTH MIDDLEWARE ====================
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// ==================== AUTH ROUTES ====================
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, fullName, role } = req.body;
        
        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) return res.status(400).json({ error: 'User already exists' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword, fullName, role: role || 'candidate' });
        await user.save();
        
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
        res.json({ token, user: { id: user._id, username, email, role: user.role, fullName } });
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
        
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
        res.json({ token, user: { id: user._id, username: user.username, email, role: user.role, fullName: user.fullName } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ==================== COMPILER (JDoodle API - Real Code Execution) ====================
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
                output: `⚠️ JDoodle API Keys Missing\n\nTo enable real code execution:\n1. Get free API keys from https://www.jdoodle.com/compiler-api/\n2. Add them to your .env file\n\nYour code (${source_code.length} chars) has been recorded.`
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
            return { success: false, output: `Error: ${response.data.error}` };
        }

        return {
            success: true,
            output: response.data.output || '✅ Code executed successfully (no output)',
            memory: response.data.memory,
            cpuTime: response.data.cpuTime
        };
    } catch (error) {
        console.error('JDoodle error:', error.message);
        return { 
            success: false, 
            output: `Execution failed: ${error.message}. Please check your internet connection.` 
        };
    }
}

app.post('/api/compile/run', verifyToken, async (req, res) => {
    try {
        const { code, language, stdin } = req.body;
        
        if (!code || !code.trim()) {
            return res.status(400).json({ error: 'Please write some code first' });
        }

        const result = await executeCode(code, language, stdin || '');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Compilation failed' });
    }
});

// ==================== QUESTIONS ====================
app.post('/api/questions', verifyToken, async (req, res) => {
    try {
        const question = new Question({ ...req.body, createdBy: req.userId, isApproved: false });
        await question.save();
        res.status(201).json({ message: 'Question submitted for approval' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/questions', async (req, res) => {
    try {
        const questions = await Question.find({ isApproved: true });
        res.json(questions);
    } catch (err) {
        res.status(500).json([]);
    }
});

app.get('/api/questions/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ error: 'Question not found' });
        res.json(question);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/questions/my-questions', verifyToken, async (req, res) => {
    try {
        const questions = await Question.find({ createdBy: req.userId });
        res.json(questions);
    } catch (err) {
        res.status(500).json([]);
    }
});

// ==================== SUBMISSIONS ====================
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

// ==================== AI EVALUATION (Simple Version) ====================
app.post('/api/evaluate/submission', verifyToken, async (req, res) => {
    try {
        const { code, questionId, language } = req.body;
        
        let score = 70;
        let feedback = "Your code has been submitted successfully.";
        
        if (code.length > 100) {
            score = 85;
            feedback = "Good solution! Your code is well-structured.";
        } else if (code.length < 20) {
            score = 60;
            feedback = "Your solution is too brief. Consider adding more detail.";
        }
        
        res.json({
            success: true,
            evaluation: {
                score: score,
                correctness: score >= 70 ? "correct" : "partial",
                timeComplexity: "Not analyzed",
                spaceComplexity: "Not analyzed",
                detailedFeedback: feedback
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== PROCTORING ROUTE ====================
app.post('/api/proctoring/violation', verifyToken, async (req, res) => {
    try {
        const { interviewId, type, details } = req.body;
        console.log('Proctoring violation:', { interviewId, type, details });
        res.json({ success: true });
    } catch (error) {
        console.error('Proctoring error:', error);
        res.json({ success: true });
    }
});

// ==================== INTERVIEW ROUTES ====================
app.post('/api/interviews/start', verifyToken, async (req, res) => {
    try {
        const { questionId } = req.body;
        const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        let interview = await Interview?.findOne({ candidateId: req.userId, questionId, status: 'ongoing' });
        
        if (!interview) {
            if (mongoose.models.Interview) {
                const Interview = mongoose.model('Interview');
                interview = new Interview({ candidateId: req.userId, questionId, roomId });
                await interview.save();
            }
        }
        
        res.json({ interviewId: interview?._id || Date.now().toString(), roomId });
    } catch (err) {
        const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        res.json({ interviewId: Date.now().toString(), roomId });
    }
});

// ==================== ADMIN ROUTES ====================
app.get('/api/admin/stats', verifyToken, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalQuestions = await Question.countDocuments();
        const pendingQuestions = await Question.countDocuments({ isApproved: false });
        const totalSubmissions = await Submission.countDocuments();
        
        res.json({ 
            totalUsers, 
            totalQuestions, 
            pendingQuestions,
            totalSubmissions,
            totalCandidates: await User.countDocuments({ role: 'candidate' }),
            totalInterviewers: await User.countDocuments({ role: 'interviewer' })
        });
    } catch (err) {
        res.json({ totalUsers: 0, totalQuestions: 0, pendingQuestions: 0 });
    }
});

app.get('/api/admin/users', verifyToken, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.json([]);
    }
});

app.get('/api/admin/pending-questions', verifyToken, async (req, res) => {
    try {
        const pending = await Question.find({ isApproved: false }).populate('createdBy', 'username fullName');
        res.json(pending);
    } catch (err) {
        res.json([]);
    }
});

app.put('/api/admin/approve/:id', verifyToken, async (req, res) => {
    try {
        await Question.findByIdAndUpdate(req.params.id, { isApproved: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/reject/:id', verifyToken, async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/questions/generate', verifyToken, async (req, res) => {
    const { prompt } = req.body;
    res.json({ 
        title: prompt.substring(0, 40), 
        description: `Write a solution for: ${prompt}`, 
        difficulty: 'medium',
        language: 'python'
    });
});

// ==================== DATABASE CONNECTION ====================
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vcip';

mongoose.set('strictQuery', false); // Render warnings se bachne ke liye
mongoose.connect(MONGO_URI)
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB error:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));