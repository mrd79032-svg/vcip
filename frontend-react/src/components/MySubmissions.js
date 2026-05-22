import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function MySubmissions() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://vcip-backend-utej.onrender.com/api/submissions/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading submissions...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <div>
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">My Submissions</h4>
        </div>
        <div className="card-body">
          <p>Welcome, {user?.fullName || user?.username}! Here are all your coding submissions.</p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          No submissions yet. Start an interview to submit your code!
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Difficulty</th>
                <th>Score</th>
                <th>Submitted On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, index) => (
                <tr key={sub._id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{sub.questionId?.title || 'Unknown Question'}</strong>
                    <br />
                    <small className="text-muted">{sub.questionId?.description?.substring(0, 60)}...</small>
                  </td>
                  <td>
                    <span className={`badge ${sub.questionId?.difficulty === 'easy' ? 'bg-success' : sub.questionId?.difficulty === 'medium' ? 'bg-warning' : 'bg-danger'}`}>
                      {sub.questionId?.difficulty || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${sub.score >= 70 ? 'bg-success' : sub.score >= 40 ? 'bg-warning' : 'bg-danger'} fs-6`}>
                      {sub.score}%
                    </span>
                  </td>
                  <td>{new Date(sub.submittedAt).toLocaleString()}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-info"
                      onClick={() => window.location.href = `/submission/${sub._id}`}
                    >
                      <i className="fas fa-eye me-1"></i> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MySubmissions;