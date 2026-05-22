import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateQuestion() {
    const [prompt, setPrompt] = useState('');
    const [generated, setGenerated] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setMessage('Please enter a prompt');
            return;
        }
        setLoading(true);
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://vcip-backend-utej.onrender.com/api/questions/generate', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ prompt })
            });
            const data = await res.json();
            setGenerated(data);
            setMessage('✅ Question generated! Review and submit.');
        } catch (err) {
            setMessage('❌ Error generating question');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!generated) {
            setMessage('Please generate a question first');
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://vcip-backend-utej.onrender.com/api/questions', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(generated)
            });
            const data = await res.json();
            setMessage('✅ Question submitted for approval! Redirecting...');
            setTimeout(() => navigate('/interviewer-dashboard'), 2000);
        } catch (err) {
            setMessage('❌ Error submitting question');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h4>Create Coding Question with AI</h4>
                </div>
                <div className="card-body">
                    {message && <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
                    <div className="mb-3">
                        <label className="form-label">Describe the coding problem:</label>
                        <textarea className="form-control" rows="3" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Example: Create a function to check if a number is prime" />
                    </div>
                    <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
                        {loading ? 'Generating...' : 'Generate with AI'}
                    </button>
                    {generated && (
                        <div className="mt-4">
                            <hr />
                            <h5>Generated Question:</h5>
                            <div className="border p-3 rounded bg-light">
                                <p><strong>Title:</strong> {generated.title}</p>
                                <p><strong>Description:</strong> {generated.description}</p>
                                <p><strong>Difficulty:</strong> {generated.difficulty}</p>
                            </div>
                            <button className="btn btn-success mt-2" onClick={handleSubmit} disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit for Approval'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CreateQuestion;import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateQuestion() {
    const [prompt, setPrompt] = useState('');
    const [generated, setGenerated] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setMessage('Please enter a prompt');
            return;
        }
        setLoading(true);
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://vcip-backend-utej.onrender.com/api/questions/generate', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ prompt })
            });
            const data = await res.json();
            setGenerated(data);
            setMessage('✅ Question generated!');
        } catch (err) {
            setMessage('❌ Error generating question');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!generated) {
            setMessage('Please generate a question first');
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await fetch('https://vcip-backend-utej.onrender.com/api/questions', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(generated)
            });
            setMessage('✅ Question submitted for approval! Redirecting...');
            setTimeout(() => navigate('/interviewer-dashboard'), 2000);
        } catch (err) {
            setMessage('❌ Error submitting question');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h4>Create Coding Question with AI</h4>
                </div>
                <div className="card-body">
                    {message && <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
                    <div className="mb-3">
                        <label className="form-label">Describe the coding problem:</label>
                        <textarea className="form-control" rows="3" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Example: Create a function to check if a number is prime" />
                    </div>
                    <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
                        {loading ? 'Generating...' : 'Generate with AI'}
                    </button>
                    {generated && (
                        <div className="mt-4">
                            <hr />
                            <h5>Generated Question:</h5>
                            <div className="border p-3 rounded bg-light">
                                <p><strong>Title:</strong> {generated.title}</p>
                                <p><strong>Description:</strong> {generated.description}</p>
                                <p><strong>Difficulty:</strong> {generated.difficulty}</p>
                            </div>
                            <button className="btn btn-success mt-2" onClick={handleSubmit} disabled={loading}>
                                Submit for Approval
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CreateQuestion;