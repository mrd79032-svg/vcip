import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

const LiveInterview = () => {
    const { interviewId, roomId } = useParams();
    const navigate = useNavigate();
    
    const [socket, setSocket] = useState(null);
    const [user, setUser] = useState(null);
    const [isInterviewer, setIsInterviewer] = useState(false);
    const [question, setQuestion] = useState(null);
    const [code, setCode] = useState('// Write your code here\nconsole.log("Hello World!");');
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState('');
    const [isInterviewActive, setIsInterviewActive] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState('Connecting...');
    
    // AI Evaluation States
    const [aiEvaluation, setAiEvaluation] = useState(null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [showEvaluation, setShowEvaluation] = useState(false);
    
    const codeEditorRef = useRef();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
        // IMPORTANT: Check role correctly
        const isInt = userData.role === 'interviewer' || userData.role === 'admin';
        setIsInterviewer(isInt);
        
        console.log('=== DEBUG INFO ===');
        console.log('Full userData:', userData);
        console.log('User role:', userData.role);
        console.log('Is Interviewer:', isInt);
        console.log('Editor will be readOnly:', isInt);
        console.log('=================');
        
        fetchInterviewDetails();
        initSocket(userData, isInt);
        
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    const fetchInterviewDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/interviews/${interviewId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.data && res.data.questionId) {
                setQuestion(res.data.questionId);
            }
        } catch (err) {
            console.error('Failed to fetch interview:', err);
        }
    };

    const initSocket = (userData, isInt) => {
        const newSocket = io('http://localhost:5000', {
            transports: ['polling'],
            reconnection: true
        });
        
        newSocket.on('connect', () => {
            console.log('Socket connected!');
            setConnectionStatus('Connected');
            
            newSocket.emit('register-user', {
                userId: userData._id,
                role: isInt ? 'interviewer' : 'candidate',
                roomId: roomId
            });
            
            newSocket.emit('join-interview-room', roomId);
        });
        
        newSocket.on('connect_error', (error) => {
            console.error('Socket error:', error);
            setConnectionStatus('Connection failed');
        });
        
        newSocket.on('code-update', (data) => {
            console.log('Code update received:', data);
            if (isInt) {
                setCode(data.code);
                setLanguage(data.language);
                if (codeEditorRef.current) {
                    codeEditorRef.current.value = data.code;
                }
            }
        });
        
        newSocket.on('interview-ended', () => {
            setIsInterviewActive(false);
            alert('Interview has been ended');
            navigate('/candidate-dashboard');
        });
        
        setSocket(newSocket);
    };

    // THIS IS THE KEY FIX - Make sure handleCodeChange works
    const handleCodeChange = (e) => {
        const newCode = e.target.value;
        console.log('✅ Code changed! New length:', newCode.length);
        setCode(newCode);
        
        // Send update to interviewer if candidate
        if (!isInterviewer && socket && socket.connected && isInterviewActive) {
            socket.emit('code-update', {
                roomId: roomId,
                code: newCode,
                language: language
            });
        }
    };

    const handleRunCode = async () => {
        console.log('Run code clicked');
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/compile/run', {
                code: code,
                language: language,
                stdin: ''
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            setOutput(response.data.output || response.data.error || 'No output');
        } catch (err) {
            console.error('Compilation error:', err);
            setOutput('Error: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleSubmit = async () => {
        console.log('Submit clicked');
        try {
            setIsEvaluating(true);
            const token = localStorage.getItem('token');
            
            await axios.post('http://localhost:5000/api/submissions', {
                code: code,
                questionId: interviewId,
                language: language
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const evalResponse = await axios.post('http://localhost:5000/api/evaluate/submission', {
                code: code,
                questionId: interviewId,
                language: language
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (evalResponse.data.success) {
                setAiEvaluation(evalResponse.data.evaluation);
                setShowEvaluation(true);
                alert(`✅ AI Score: ${evalResponse.data.evaluation.score}/100`);
            }
        } catch (err) {
            console.error('Submission error:', err);
            alert('Submission failed: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsEvaluating(false);
        }
    };

    const endInterview = () => {
        if (window.confirm('End this interview?')) {
            socket?.emit('end-interview', roomId);
            navigate('/interviewer-dashboard');
        }
    };

    // Proctoring
    useEffect(() => {
        if (isInterviewer) return;
        
        let tabSwitchCount = 0;
        const handleVisibilityChange = () => {
            if (document.hidden && isInterviewActive) {
                tabSwitchCount++;
                alert(`⚠️ Tab switch warning ${tabSwitchCount}/3`);
                
                socket?.emit('tab-warning', { roomId, count: tabSwitchCount });
                
                if (tabSwitchCount >= 3) {
                    alert('Interview terminated due to repeated tab switching.');
                    navigate('/candidate-dashboard');
                }
            }
        };
        
        const disableCopyPaste = (e) => {
            e.preventDefault();
            alert('Copy-Paste disabled during interview');
            return false;
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('copy', disableCopyPaste);
        document.addEventListener('paste', disableCopyPaste);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('copy', disableCopyPaste);
            document.removeEventListener('paste', disableCopyPaste);
        };
    }, [isInterviewer, isInterviewActive, roomId]);

    return (
        <div style={{ padding: '20px', background: '#1e1e1e', minHeight: '100vh', color: 'white' }}>
            {/* Status Bar */}
            <div style={{ 
                background: connectionStatus === 'Connected' ? '#28a745' : '#ffc107', 
                color: '#1e1e1e', 
                padding: '8px', 
                textAlign: 'center',
                borderRadius: '5px',
                marginBottom: '15px',
                fontWeight: 'bold'
            }}>
                {connectionStatus}
            </div>
            
            {/* IMPORTANT DEBUG INFO - Shows exactly what's happening */}
            <div style={{ 
                background: '#333', 
                padding: '12px', 
                borderRadius: '5px', 
                marginBottom: '15px', 
                fontSize: '14px',
                fontFamily: 'monospace',
                borderLeft: isInterviewer ? '4px solid #dc3545' : '4px solid #28a745'
            }}>
                <strong>🔍 DEBUG INFORMATION:</strong><br/>
                📌 User Role: <span style={{ color: '#ffc107' }}>{user?.role || 'Unknown'}</span><br/>
                📌 Is Interviewer: <span style={{ color: isInterviewer ? '#dc3545' : '#28a745' }}>{String(isInterviewer)}</span><br/>
                📌 Editor ReadOnly: <span style={{ color: isInterviewer ? '#dc3545' : '#28a745' }}>{String(isInterviewer)}</span><br/>
                📌 You can type: <span style={{ color: !isInterviewer ? '#28a745' : '#dc3545' }}>{!isInterviewer ? '✅ YES' : '❌ NO (you are interviewer)'}</span><br/>
                📌 Socket Connected: {socket?.connected ? '✅ Yes' : '❌ No'}
            </div>
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                
                {/* Code Editor Section */}
                <div style={{ flex: '2', minWidth: '400px' }}>
                    <div style={{ background: '#2d2d2d', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ padding: '15px', background: '#3d3d3d', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                            <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: '8px 12px', borderRadius: '5px', background: '#1e1e1e', color: 'white', border: 'none' }}>
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                                <option value="c">C</option>
                            </select>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={handleRunCode} style={{ padding: '8px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                    ▶ Run Code
                                </button>
                                <button onClick={handleSubmit} disabled={isEvaluating} style={{ padding: '8px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                    {isEvaluating ? 'Evaluating...' : '📤 Submit'}
                                </button>
                                {isInterviewer && <button onClick={endInterview} style={{ padding: '8px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>⏹ End</button>}
                            </div>
                        </div>
                        
                        {question && (
                            <div style={{ padding: '15px', background: '#252525', borderBottom: '1px solid #555' }}>
                                <h4 style={{ color: '#ffc107' }}>{question.title}</h4>
                                <p>{question.description}</p>
                            </div>
                        )}
                        
                        {/* THIS IS THE TEXTAREA - IT SHOULD BE EDITABLE FOR CANDIDATES */}
                        <textarea
                            ref={codeEditorRef}
                            value={code}
                            onChange={handleCodeChange}
                            placeholder="Write your code here..."
                            readOnly={isInterviewer}
                            style={{
                                width: '100%',
                                minHeight: '400px',
                                background: '#1e1e1e',
                                color: '#d4d4d4',
                                fontFamily: 'monospace',
                                fontSize: '14px',
                                padding: '15px',
                                border: 'none',
                                resize: 'vertical',
                                outline: 'none'
                            }}
                        />
                        
                        <div style={{ padding: '15px', background: '#252525' }}>
                            <h4>Output:</h4>
                            <pre style={{ background: '#0a0a0a', padding: '10px', borderRadius: '5px', whiteSpace: 'pre-wrap' }}>
                                {output || 'Click "Run Code" to see output'}
                            </pre>
                        </div>
                    </div>
                </div>
                
                {/* AI Evaluation Panel */}
                {showEvaluation && aiEvaluation && (
                    <div style={{ flex: '1', minWidth: '280px', background: '#2d2d2d', borderRadius: '10px', padding: '15px' }}>
                        <h3 style={{ color: '#28a745' }}>🤖 AI Score: {aiEvaluation.score}/100</h3>
                        <p><strong>Correctness:</strong> {aiEvaluation.correctness}</p>
                        <p><strong>Time:</strong> {aiEvaluation.timeComplexity}</p>
                        <p><strong>Space:</strong> {aiEvaluation.spaceComplexity}</p>
                        <p><strong>Feedback:</strong> {aiEvaluation.detailedFeedback}</p>
                        <button onClick={() => setShowEvaluation(false)} style={{ padding: '8px 16px', background: '#555', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveInterview;