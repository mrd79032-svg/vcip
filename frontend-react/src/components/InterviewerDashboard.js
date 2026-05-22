import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
        
        // Refresh active interviews every 5 seconds
        const interval = setInterval(fetchActiveInterviews, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchMyQuestions = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://vcip-backend-utej.onrender.com/api/questions/my-questions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setMyQuestions(data);
            } else {
                setMyQuestions([]);
            }
        } catch (err) {
            console.error(err);
            setMyQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchActiveInterviews = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('https://vcip-backend-utej.onrender.com/api/interviews/active', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setActiveInterviews(data);
            } else {
                setActiveInterviews([]);
            }
        } catch (err) {
            console.error('Error fetching active interviews:', err);
            setActiveInterviews([]);
        }
    };

    return (
        <div>
            <div className="card mb-4">
                <div className="card-header bg-success text-white">
                    <h4 className="mb-0">Interviewer Dashboard</h4>
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

            {/* Active Interviews Section - Live Video Calls */}
            {activeInterviews.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header bg-warning">
                        <h4 className="mb-0">🎥 Live Active Interviews</h4>
                        <small>Join now to watch candidate coding live</small>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            {activeInterviews.map(interview => (
                                <div className="col-md-6 mb-3" key={interview._id}>
                                    <div className="card border-danger">
                                        <div className="card-body">
                                            <h5>👤 Candidate: {interview.candidateId?.fullName || interview.candidateId?.username || 'Unknown'}</h5>
                                            <p>📝 Question: {interview.questionId?.title || 'Loading...'}</p>
                                            <p>🟢 Status: <span style={{ color: 'green', fontWeight: 'bold' }}>LIVE NOW</span></p>
                                            <p>⏰ Started: {new Date(interview.startedAt).toLocaleTimeString()}</p>
                                            <Link to={`/live-interview/${interview._id}/${interview.roomId}`} className="btn btn-danger btn-lg w-100">
                                                🎥 Join Live Interview
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* If no active interviews */}
            {activeInterviews.length === 0 && (
                <div className="card mb-4">
                    <div className="card-header bg-secondary text-white">
                        <h4 className="mb-0">🎥 Live Active Interviews</h4>
                    </div>
                    <div className="card-body text-center">
                        <p>No active interviews at the moment.</p>
                        <p className="text-muted">When a candidate starts an interview, it will appear here.</p>
                    </div>
                </div>
            )}

            <h3>My Submitted Questions</h3>
            {loading ? (
                <p>Loading...</p>
            ) : myQuestions.length === 0 ? (
                <p>You haven't submitted any questions yet.</p>
            ) : (
                <div className="list-group">
                    {myQuestions.map(q => (
                        <div key={q._id} className="list-group-item">
                            <h5>{q.title}</h5>
                            <p>{q.description?.substring(0, 100)}...</p>
                            <span className={`badge ${q.isApproved ? 'bg-success' : 'bg-warning'}`}>
                                {q.isApproved ? 'Approved' : 'Pending Approval'}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default InterviewerDashboard;