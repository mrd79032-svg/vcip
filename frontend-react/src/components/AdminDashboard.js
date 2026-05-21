import React, { useState, useEffect } from 'react';

function AdminDashboard() {
    const [user, setUser] = useState({});
    const [pendingQuestions, setPendingQuestions] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('pending');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        setLoading(true);
        
        try {
            // Fetch stats
            const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const statsData = await statsRes.json();
            setStats(statsData);
            
            // Fetch pending questions
            const pendingRes = await fetch('http://localhost:5000/api/admin/pending-questions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const pendingData = await pendingRes.json();
            setPendingQuestions(pendingData);
            
            // Fetch all users
            const usersRes = await fetch('http://localhost:5000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const usersData = await usersRes.json();
            setUsers(usersData);
            
        } catch (err) {
            console.error('Error:', err);
            setMessage('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const approveQuestion = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await fetch(`http://localhost:5000/api/admin/approve/${id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage('✅ Question approved!');
            fetchData();
        } catch (err) {
            setMessage('❌ Failed to approve');
        }
    };

    const rejectQuestion = async (id) => {
        if (!window.confirm('Reject this question?')) return;
        const token = localStorage.getItem('token');
        try {
            await fetch(`http://localhost:5000/api/admin/reject/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage('✅ Question rejected');
            fetchData();
        } catch (err) {
            setMessage('❌ Failed to reject');
        }
    };

    if (loading) return <div className="text-center mt-5">Loading dashboard...</div>;

    return (
        <div className="container mt-4">
            {/* Welcome Card */}
            <div className="card mb-4">
                <div className="card-header bg-success text-white">
                    <h4 className="mb-0">Admin Dashboard</h4>
                </div>
                <div className="card-body">
                    <h3>Welcome, {user.fullName || user.username}!</h3>
                    <p>Role: {user.role}</p>
                    <p>Email: {user.email}</p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card bg-primary text-white">
                        <div className="card-body">
                            <h5>Total Users</h5>
                            <h2>{stats.totalUsers || 0}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-success text-white">
                        <div className="card-body">
                            <h5>Candidates</h5>
                            <h2>{stats.totalCandidates || 0}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-info text-white">
                        <div className="card-body">
                            <h5>Interviewers</h5>
                            <h2>{stats.totalInterviewers || 0}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-warning text-white">
                        <div className="card-body">
                            <h5>Pending</h5>
                            <h2>{stats.pendingQuestions || 0}</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Message */}
            {message && <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>{message}</div>}

            {/* Tabs */}
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
                        Pending Questions ({pendingQuestions.length})
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                        All Users ({users.length})
                    </button>
                </li>
            </ul>

            {/* Pending Questions Tab */}
            {activeTab === 'pending' && (
                <div className="card">
                    <div className="card-header bg-warning">Questions Awaiting Approval</div>
                    <div className="card-body">
                        {pendingQuestions.length === 0 ? (
                            <div className="alert alert-info">No pending questions.</div>
                        ) : (
                            pendingQuestions.map(q => (
                                <div key={q._id} className="list-group-item mb-2">
                                    <h5>{q.title}</h5>
                                    <p>{q.description}</p>
                                    <small>By: {q.createdBy?.fullName}</small>
                                    <div className="mt-2">
                                        <button className="btn btn-success btn-sm me-2" onClick={() => approveQuestion(q._id)}>Approve</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => rejectQuestion(q._id)}>Reject</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* All Users Tab */}
            {activeTab === 'users' && (
                <div className="card">
                    <div className="card-header bg-info">Registered Users</div>
                    <div className="card-body">
                        {users.length === 0 ? (
                            <div className="alert alert-info">No users found.</div>
                        ) : (
                            <table className="table table-bordered">
                                <thead className="table-dark">
                                    <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u._id}>
                                            <td>{u.fullName}</td>
                                            <td>{u.email}</td>
                                            <td><span className={`badge ${u.role === 'admin' ? 'bg-danger' : u.role === 'interviewer' ? 'bg-warning' : 'bg-success'}`}>{u.role}</span></td>
                                            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;