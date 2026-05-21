import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function CandidateDashboard() {
    const [user, setUser] = useState({});
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/questions');
            const data = await res.json();
            setQuestions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div>
            <div className="card mb-4">
                <div className="card-header bg-success text-white">
                    <h4 className="mb-0">Candidate Dashboard</h4>
                </div>
                <div className="card-body">
                    <h3>Welcome, {user.fullName || user.username}!</h3>
                    <p>Role: {user.role}</p>
                    <p>Email: {user.email}</p>
                </div>
            </div>

            <h3>Available Coding Questions</h3>
            {questions.length === 0 ? (
                <p>No questions available yet.</p>
            ) : (
                <div className="row">
                    {questions.map(q => (
                        <div className="col-md-4 mb-3" key={q._id}>
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5>{q.title}</h5>
                                    <p className="text-muted">Difficulty: {q.difficulty}</p>
                                    <p className="small">{q.description?.substring(0, 100)}...</p>
                                    <Link to={`/interview/${q._id}`} className="btn btn-primary">Start Interview</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CandidateDashboard;