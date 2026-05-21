import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from './Editor';

function Interview() {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(true);
    const [warningCount, setWarningCount] = useState(0);

    // Anti-cheat: Disable copy-paste
    useEffect(() => {
        const disableCopyPaste = (e) => {
            e.preventDefault();
            setWarningCount(prev => prev + 1);
            alert('Copy-Paste is disabled during interview!');
            return false;
        };
        
        document.addEventListener('copy', disableCopyPaste);
        document.addEventListener('cut', disableCopyPaste);
        document.addEventListener('paste', disableCopyPaste);
        
        return () => {
            document.removeEventListener('copy', disableCopyPaste);
            document.removeEventListener('cut', disableCopyPaste);
            document.removeEventListener('paste', disableCopyPaste);
        };
    }, []);

    const fetchQuestion = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/questions/${id}`);
            const data = await res.json();
            setQuestion(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/submissions', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ code, questionId: id })
        });
        const data = await res.json();
        setOutput(data.aiReview || 'Code submitted successfully!');
    };

    useEffect(() => { fetchQuestion(); }, [id]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            {warningCount > 0 && (
                <div className="alert alert-warning">⚠️ {warningCount} warning(s) recorded.</div>
            )}
            <div className="card mb-3">
                <div className="card-header bg-primary text-white">
                    <h4>{question.title}</h4>
                </div>
                <div className="card-body">
                    <p>{question.description}</p>
                </div>
            </div>
            <Editor code={code} onChange={setCode} language="python" />
            <button className="btn btn-success mt-3" onClick={handleSubmit}>Submit Code</button>
            {output && <pre className="mt-3 bg-light p-3">{output}</pre>}
        </div>
    );
}

export default Interview;