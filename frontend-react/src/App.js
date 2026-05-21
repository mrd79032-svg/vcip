import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Developers from './components/Developers';
import DeveloperDetails from './components/DeveloperDetails';
import OnlineCompiler from './components/OnlineCompiler';
import LiveInterview from './components/LiveInterview';

// ==================== HOME COMPONENT ====================
function Home() {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-overlay"></div>
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title animate-fade-in">Virtual Coding Interview Platform</h1>
                        <p className="hero-subtitle animate-fade-in-delay">AI-powered coding interviews with real-time evaluation</p>
                        <div className="hero-buttons animate-fade-in-delay-2">
                            <Link to="/register" className="btn btn-primary btn-lg zoom-btn">Get Started</Link>
                            <Link to="/login" className="btn btn-outline-light btn-lg zoom-btn">Login</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="stats-section">
                <div className="container">
                    <div className="row text-center">
                        <div className="col-md-3 col-sm-6">
                            <div className="stat-card zoom-card">
                                <div className="stat-number">500+</div>
                                <div className="stat-label">Coding Problems</div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <div className="stat-card zoom-card">
                                <div className="stat-number">10K+</div>
                                <div className="stat-label">Interviews Conducted</div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <div className="stat-card zoom-card">
                                <div className="stat-number">98%</div>
                                <div className="stat-label">Satisfaction Rate</div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <div className="stat-card zoom-card">
                                <div className="stat-number">50+</div>
                                <div className="stat-label">Companies Trust Us</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="features-section">
                <div className="container">
                    <h2 className="section-title">Powerful Features</h2>
                    <p className="section-subtitle">Everything you need for a seamless coding interview experience</p>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="feature-card zoom-card">
                                <div className="feature-icon">🤖</div>
                                <h3>AI-Powered Evaluation</h3>
                                <p>Get instant feedback on your code quality and complexity</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card zoom-card">
                                <div className="feature-icon">💻</div>
                                <h3>Live Code Editor</h3>
                                <p>Write and run code in multiple languages</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card zoom-card">
                                <div className="feature-icon">🎥</div>
                                <h3>Live Monitoring</h3>
                                <p>Interviewers watch candidates in real-time</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Role Selection Section */}
            <div className="login-options-section">
                <div className="container">
                    <h2 className="section-title">Choose Your Role</h2>
                    <p className="section-subtitle">Select the role that best describes you to get started</p>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="role-card candidate-card zoom-card">
                                <div className="role-icon">👨‍💻</div>
                                <h3>Candidate</h3>
                                <p>Take coding interviews and showcase your skills</p>
                                <Link to="/login?role=candidate" className="btn btn-role zoom-btn">Login as Candidate</Link>
                                <small className="register-link">New? <Link to="/register?role=candidate">Create Account</Link></small>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="role-card interviewer-card zoom-card">
                                <div className="role-icon">👨‍🏫</div>
                                <h3>Interviewer</h3>
                                <p>Create questions and conduct live interviews</p>
                                <Link to="/login?role=interviewer" className="btn btn-role zoom-btn">Login as Interviewer</Link>
                                <small className="register-link">New? <Link to="/register?role=interviewer">Create Account</Link></small>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="role-card admin-card zoom-card">
                                <div className="role-icon">👨‍💼</div>
                                <h3>Admin</h3>
                                <p>Manage questions and oversee platform</p>
                                <Link to="/login?role=admin" className="btn btn-role zoom-btn">Login as Admin</Link>
                                <small className="register-link">New? <Link to="/register?role=admin">Create Account</Link></small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="how-it-works-section">
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <p className="section-subtitle">Simple steps to conduct or take a coding interview</p>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="step-card zoom-card">
                                <div className="step-number">1</div>
                                <h3>Create Account</h3>
                                <p>Sign up as a candidate, interviewer, or admin</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="step-card zoom-card">
                                <div className="step-number">2</div>
                                <h3>Choose Question</h3>
                                <p>Select from a library of coding problems</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="step-card zoom-card">
                                <div className="step-number">3</div>
                                <h3>Write Code</h3>
                                <p>Solve problems in your preferred language</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="step-card zoom-card">
                                <div className="step-number">4</div>
                                <h3>Get Results</h3>
                                <p>Receive instant AI feedback and scores</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Developers Section Preview */}
            <div className="developers-section">
                <div className="container">
                    <h2 className="section-title">Meet Our Developers</h2>
                    <p className="section-subtitle">The talented team behind VCIP</p>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="developer-card zoom-card">
                                <div className="developer-image">👨‍💻</div>
                                <h3>Md Rasid Alam</h3>
                                <p>Full Stack Developer</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="developer-card zoom-card">
                                <div className="developer-image">👨‍💻</div>
                                <h3>Md Faiz Alam</h3>
                                <p>Backend Developer</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="developer-card zoom-card">
                                <div className="developer-image">👨‍💻</div>
                                <h3>Md Asif</h3>
                                <p>Frontend Developer</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="developer-card zoom-card">
                                <div className="developer-image">👩‍💻</div>
                                <h3>Mehwish Fatima</h3>
                                <p>UI/UX Designer</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-4">
                        <Link to="/developers" className="btn btn-light zoom-btn">View All Developers</Link>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Transform Your Coding Interviews?</h2>
                        <p>Join thousands of developers and companies using VCIP for technical interviews.</p>
                        <Link to="/register" className="btn btn-primary btn-lg zoom-btn">Create Free Account</Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <h4>VCIP</h4>
                            <p>Virtual Coding Interview Platform - Making technical interviews smarter, faster, and fairer.</p>
                        </div>
                        <div className="col-md-4">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/developers">Developers</Link></li>
                                <li><Link to="/compiler">Online Compiler</Link></li>
                                <li><Link to="/register">Create Account</Link></li>
                                <li><Link to="/login">Login</Link></li>
                            </ul>
                        </div>
                        <div className="col-md-4">
                            <h4>Contact</h4>
                            <p>Email: support@vcip.com</p>
                            <p>Phone: +91 1234567890</p>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 VCIP. All rights reserved. | Developed by Diploma in Computer Science, Jamia Millia Islamia</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// ==================== LOGIN COMPONENT ====================
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const role = new URLSearchParams(location.search).get('role') || 'candidate';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            if (data.user.role === 'admin') navigate('/admin');
            else if (data.user.role === 'interviewer') navigate('/interviewer-dashboard');
            else navigate('/candidate-dashboard');
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <div className="card">
                <div className="card-header bg-primary text-white">Login as {role}</div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <input type="email" className="form-control mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                        <input type="password" className="form-control mb-2" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// ==================== REGISTER COMPONENT ====================
function Register() {
    const [form, setForm] = useState({ username: '', email: '', password: '', fullName: '', role: 'candidate' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const role = new URLSearchParams(location.search).get('role') || 'candidate';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, role })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setSuccess('Registration successful! Redirecting...');
            setTimeout(() => {
                if (data.user.role === 'admin') navigate('/admin');
                else if (data.user.role === 'interviewer') navigate('/interviewer-dashboard');
                else navigate('/candidate-dashboard');
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <div className="card">
                <div className="card-header bg-primary text-white">Register as {role}</div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={handleSubmit}>
                        <input type="text" className="form-control mb-2" placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} required />
                        <input type="email" className="form-control mb-2" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} required />
                        <input type="text" className="form-control mb-2" placeholder="Full Name" onChange={e => setForm({ ...form, fullName: e.target.value })} required />
                        <input type="password" className="form-control mb-2" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} required />
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// ==================== CANDIDATE DASHBOARD ====================
function CandidateDashboard() {
    const [user, setUser] = useState({});
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/questions');
            const data = await res.json();
            if (Array.isArray(data)) {
                setQuestions(data);
            } else {
                console.error('Expected array but got:', data);
                setQuestions([]);
            }
        } catch (err) {
            console.error(err);
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    const startLiveInterview = async (questionId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/interviews/start', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ questionId })
            });
            const data = await response.json();
            
            if (response.ok) {
                const { interviewId, roomId } = data;
                navigate(`/live-interview/${interviewId}/${roomId}`);
            } else {
                alert('Failed to start interview: ' + data.error);
            }
        } catch (err) {
            console.error('Error starting interview:', err);
            alert('Failed to start interview. Please try again.');
        }
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div>
            <div className="card mb-4">
                <div className="card-header bg-success text-white">
                    <h4>Candidate Dashboard</h4>
                </div>
                <div className="card-body">
                    <h3>Welcome, {user.fullName || user.username}!</h3>
                    <p>Role: {user.role}</p>
                    <p>Email: {user.email}</p>
                    <hr />
                    <Link to="/compiler" className="btn btn-info me-2">💻 Try Online Compiler</Link>
                </div>
            </div>
            <h3>Available Coding Questions</h3>
            {!Array.isArray(questions) || questions.length === 0 ? (
                <p>No questions available yet.</p>
            ) : (
                <div className="row">
                    {questions.map(q => (
                        <div className="col-md-4 mb-3" key={q._id}>
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5>{q.title}</h5>
                                    <p className="text-muted">Difficulty: {q.difficulty}</p>
                                    <button 
                                        onClick={() => startLiveInterview(q._id)} 
                                        className="btn btn-primary"
                                    >
                                        🎥 Start Live Interview
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ==================== INTERVIEWER DASHBOARD ====================
function InterviewerDashboard() {
    const [user, setUser] = useState({});
    const [myQuestions, setMyQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeInterviews, setActiveInterviews] = useState([]);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
        fetchMyQuestions();
        fetchActiveInterviews();
    }, []);

    const fetchMyQuestions = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/questions/my-questions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setMyQuestions(data);
            } else {
                console.error('Expected array but got:', data);
                setMyQuestions([]);
            }
        } catch (err) {
            console.error('Error fetching questions:', err);
            setMyQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchActiveInterviews = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/interviews/active', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setActiveInterviews(data);
            } else {
                console.error('Expected array but got:', data);
                setActiveInterviews([]);
            }
        } catch (err) {
            console.error('Error fetching active interviews:', err);
            setActiveInterviews([]);
        }
    };

    const renderQuestions = () => {
        if (!Array.isArray(myQuestions) || myQuestions.length === 0) {
            return <p>No questions submitted yet.</p>;
        }
        
        return (
            <div className="list-group">
                {myQuestions.map(q => (
                    <div key={q._id} className="list-group-item">
                        <h5>{q.title}</h5>
                        <span className={`badge ${q.isApproved ? 'bg-success' : 'bg-warning'}`}>
                            {q.isApproved ? 'Approved' : 'Pending'}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <div className="card mb-4">
                <div className="card-header bg-success text-white">
                    <h4>Interviewer Dashboard</h4>
                </div>
                <div className="card-body">
                    <h3>Welcome, {user.fullName || user.username}!</h3>
                    <p>Role: {user.role}</p>
                    <p>Email: {user.email}</p>
                    <hr />
                    <Link to="/create-question" className="btn btn-primary me-2">Create New Question</Link>
                    <Link to="/compiler" className="btn btn-info me-2">💻 Online Compiler</Link>
                </div>
            </div>

            {Array.isArray(activeInterviews) && activeInterviews.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header bg-warning">
                        <h4>🎥 Active Interviews</h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            {activeInterviews.map(interview => (
                                <div className="col-md-6 mb-3" key={interview._id}>
                                    <div className="card">
                                        <div className="card-body">
                                            <h5>Candidate: {interview.candidateId?.fullName || interview.candidateId?.username || 'Unknown'}</h5>
                                            <p>Question: {interview.questionId?.title || 'Loading...'}</p>
                                            <Link to={`/live-interview/${interview._id}/${interview.roomId}`} className="btn btn-danger">
                                                Join Live Interview
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <h3>My Submitted Questions</h3>
            {loading ? (
                <p>Loading...</p>
            ) : (
                renderQuestions()
            )}
        </div>
    );
}

// ==================== ADMIN DASHBOARD ====================
function AdminDashboard() {
    const [user, setUser] = useState({});
    const [pendingQuestions, setPendingQuestions] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const statsData = await statsRes.json();
            setStats(statsData || {});
            
            const pendingRes = await fetch('http://localhost:5000/api/admin/pending-questions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const pendingData = await pendingRes.json();
            setPendingQuestions(Array.isArray(pendingData) ? pendingData : []);
            
            const usersRes = await fetch('http://localhost:5000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const usersData = await usersRes.json();
            setUsers(Array.isArray(usersData) ? usersData : []);
        } catch (err) {
            console.error(err);
            setStats({});
            setPendingQuestions([]);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const approveQuestion = async (id) => {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/admin/approve/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchData();
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="container mt-4">
            <div className="card mb-4">
                <div className="card-header bg-success text-white">
                    <h4>Admin Dashboard</h4>
                </div>
                <div className="card-body">
                    <h3>Welcome, {user.fullName || user.username}!</h3>
                    <p>Role: {user.role}</p>
                    <hr />
                    <Link to="/compiler" className="btn btn-info">💻 Online Compiler</Link>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-3"><div className="card bg-primary text-white"><div className="card-body"><h5>Total Users</h5><h2>{stats.totalUsers || 0}</h2></div></div></div>
                <div className="col-md-3"><div className="card bg-success text-white"><div className="card-body"><h5>Candidates</h5><h2>{stats.totalCandidates || 0}</h2></div></div></div>
                <div className="col-md-3"><div className="card bg-info text-white"><div className="card-body"><h5>Interviewers</h5><h2>{stats.totalInterviewers || 0}</h2></div></div></div>
                <div className="col-md-3"><div className="card bg-warning text-white"><div className="card-body"><h5>Pending</h5><h2>{stats.pendingQuestions || 0}</h2></div></div></div>
            </div>

            <ul className="nav nav-tabs mb-3">
                <li className="nav-item"><button className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Pending ({pendingQuestions.length})</button></li>
                <li className="nav-item"><button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users ({users.length})</button></li>
            </ul>

            {activeTab === 'pending' && (
                <div className="card">
                    <div className="card-header bg-warning">Pending Questions</div>
                    <div className="card-body">
                        {pendingQuestions.length === 0 ? <div className="alert alert-info">No pending questions.</div> :
                            pendingQuestions.map(q => (
                                <div key={q._id} className="list-group-item mb-2">
                                    <h5>{q.title}</h5>
                                    <p>{q.description}</p>
                                    <button className="btn btn-success btn-sm me-2" onClick={() => approveQuestion(q._id)}>Approve</button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="card">
                    <div className="card-header bg-info">All Users</div>
                    <div className="card-body">
                        <table className="table table-bordered">
                            <thead className="table-dark">
                                <tr><th>Name</th><th>Email</th><th>Role</th></tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <td>{u.fullName}</td>
                                        <td>{u.email}</td>
                                        <td>{u.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// ==================== CREATE QUESTION COMPONENT ====================
function CreateQuestion() {
    const [prompt, setPrompt] = useState('');
    const [generated, setGenerated] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleGenerate = async () => {
        if (!prompt.trim()) return setMessage('Enter a prompt');
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/questions/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ prompt })
            });
            setGenerated(await res.json());
            setMessage('✅ Question generated!');
        } catch (err) {
            setMessage('❌ Error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!generated) return setMessage('Generate first');
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await fetch('http://localhost:5000/api/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(generated)
            });
            setMessage('✅ Submitted! Redirecting...');
            setTimeout(() => navigate('/interviewer-dashboard'), 2000);
        } catch (err) {
            setMessage('❌ Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header bg-primary text-white">Create Question with AI</div>
                <div className="card-body">
                    {message && <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
                    <textarea className="form-control mb-2" rows="3" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe the coding problem..." />
                    <button className="btn btn-primary me-2" onClick={handleGenerate} disabled={loading}>{loading ? 'Generating...' : 'Generate with AI'}</button>
                    {generated && (
                        <div className="mt-3 border p-3 rounded">
                            <h5>{generated.title}</h5>
                            <p>{generated.description}</p>
                            <button className="btn btn-success" onClick={handleSubmit}>Submit for Approval</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ==================== INTERVIEW COMPONENT (Legacy - Kept for compatibility) ====================
function Interview() {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/questions/${id}`);
                const data = await res.json();
                setQuestion(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchQuestion();
    }, [id]);

    const handleStartLive = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/interviews/start', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ questionId: id })
            });
            const data = await response.json();
            
            if (response.ok) {
                const { interviewId, roomId } = data;
                navigate(`/live-interview/${interviewId}/${roomId}`);
            } else {
                alert('Failed to start interview: ' + data.error);
            }
        } catch (err) {
            console.error('Error starting interview:', err);
            alert('Failed to start interview. Please try again.');
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/submissions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ code, questionId: id })
        });
        const data = await res.json();
        setOutput(data.aiReview || 'Submitted!');
    };

    if (!question) return <div>Loading...</div>;

    return (
        <div>
            <h2>{question.title}</h2>
            <p>{question.description}</p>
            <textarea className="form-control" rows="10" value={code} onChange={e => setCode(e.target.value)} />
            <button className="btn btn-primary mt-2" onClick={handleSubmit}>Submit</button>
            <button className="btn btn-success mt-2 ms-2" onClick={handleStartLive}>🎥 Start Live Interview</button>
            {output && <pre className="mt-2">{output}</pre>}
            <hr />
            <Link to="/compiler" className="btn btn-info">💻 Open Full Compiler</Link>
        </div>
    );
}

// ==================== PROTECTED ROUTE ====================
function ProtectedRoute({ children, allowedRoles = [] }) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token) return <Navigate to="/login" />;
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        if (user.role === 'candidate') return <Navigate to="/candidate-dashboard" />;
        if (user.role === 'interviewer') return <Navigate to="/interviewer-dashboard" />;
        if (user.role === 'admin') return <Navigate to="/admin" />;
        return <Navigate to="/" />;
    }
    return children;
}

// ==================== NAVBAR COMPONENT ====================
function Navbar() {
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
    }, [token]);

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">VCIP</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/developers">Developers</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/compiler">💻 Compiler</Link></li>
                        {!token ? (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
                            </>
                        ) : (
                            <>
                                {user?.role === 'candidate' && <li className="nav-item"><Link className="nav-link" to="/candidate-dashboard">Dashboard</Link></li>}
                                {user?.role === 'interviewer' && (
                                    <>
                                        <li className="nav-item"><Link className="nav-link" to="/interviewer-dashboard">Dashboard</Link></li>
                                        <li className="nav-item"><Link className="nav-link" to="/create-question">Create Question</Link></li>
                                    </>
                                )}
                                {user?.role === 'admin' && <li className="nav-item"><Link className="nav-link" to="/admin">Admin Panel</Link></li>}
                                <li className="nav-item"><span className="nav-link text-light">Hello, {user?.fullName || user?.username}</span></li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

// ==================== MAIN APP ====================
function App() {
    return (
        <Router>
            <Navbar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/developers" element={<Developers />} />
                    <Route path="/developer/:id" element={<DeveloperDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/compiler" element={<ProtectedRoute><OnlineCompiler /></ProtectedRoute>} />
                    <Route path="/candidate-dashboard" element={<ProtectedRoute allowedRoles={['candidate']}><CandidateDashboard /></ProtectedRoute>} />
                    <Route path="/interviewer-dashboard" element={<ProtectedRoute allowedRoles={['interviewer', 'admin']}><InterviewerDashboard /></ProtectedRoute>} />
                    <Route path="/create-question" element={<ProtectedRoute allowedRoles={['interviewer', 'admin']}><CreateQuestion /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/interview/:id" element={<ProtectedRoute allowedRoles={['candidate']}><Interview /></ProtectedRoute>} />
                    <Route path="/live-interview/:interviewId/:roomId" element={<ProtectedRoute><LiveInterview /></ProtectedRoute>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;