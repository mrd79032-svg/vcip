import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const ProctoringWrapper = ({ children, interviewId, candidateId }) => {
    const [fullscreenActive, setFullscreenActive] = useState(false);
    const [warning, setWarning] = useState('');
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(true);

    const requestFullscreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        }
    };

    const checkFullscreen = () => {
        if (!document.fullscreenElement) {
            setFullscreenActive(false);
            setWarning('⚠️ Fullscreen mode required! Please enter fullscreen.');
            setShowFullscreenPrompt(true);
        } else {
            setFullscreenActive(true);
            setWarning('');
            setShowFullscreenPrompt(false);
        }
    };

    // Wrap logViolation in useCallback to prevent unnecessary re-renders
    const logViolation = useCallback(async (type) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('https://vcip-backend-utej.onrender.com/api/proctoring/violation', {
                interviewId: interviewId,
                candidateId: candidateId,
                type: type,
                details: `${type} detected during interview`
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error('Failed to log violation:', err);
        }
    }, [interviewId, candidateId]);

    const handleEnterFullscreen = () => {
        requestFullscreen();
        setShowFullscreenPrompt(false);
    };

    useEffect(() => {
        // Listen for fullscreen changes
        document.addEventListener('fullscreenchange', checkFullscreen);
        
        // Tab switching detection
        const handleVisibilityChange = () => {
            if (document.hidden && fullscreenActive) {
                const newCount = tabSwitchCount + 1;
                setTabSwitchCount(newCount);
                setWarning(`⚠️ Warning: Tab switching detected (${newCount}/3)!`);
                logViolation('tab_switch');
                
                if (newCount >= 3) {
                    alert('Interview terminated due to repeated tab switching.');
                    window.location.href = '/candidate-dashboard';
                }
            }
        };
        
        // Disable right-click
        const disableRightClick = (e) => {
            if (fullscreenActive) {
                e.preventDefault();
                logViolation('right_click');
                return false;
            }
        };
        
        // Disable copy-paste
        const disableCopyPaste = (e) => {
            if (fullscreenActive) {
                e.preventDefault();
                logViolation('copy_paste');
                alert('Copy-Paste is disabled during interview');
                return false;
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('contextmenu', disableRightClick);
        document.addEventListener('copy', disableCopyPaste);
        document.addEventListener('paste', disableCopyPaste);
        
        return () => {
            document.removeEventListener('fullscreenchange', checkFullscreen);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('contextmenu', disableRightClick);
            document.removeEventListener('copy', disableCopyPaste);
            document.removeEventListener('paste', disableCopyPaste);
        };
    }, [tabSwitchCount, fullscreenActive, logViolation]);

    return (
        <div>
            {/* Fullscreen prompt overlay */}
            {showFullscreenPrompt && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.95)',
                    zIndex: 9999,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    color: 'white'
                }}>
                    <h2>⚠️ Fullscreen Mode Required</h2>
                    <p>This interview requires fullscreen mode to prevent cheating.</p>
                    <button 
                        onClick={handleEnterFullscreen}
                        style={{
                            padding: '12px 24px',
                            fontSize: '18px',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginTop: '20px'
                        }}
                    >
                        Enter Fullscreen
                    </button>
                </div>
            )}
            
            {/* Warning message */}
            {warning && fullscreenActive && !showFullscreenPrompt && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#dc3545',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    zIndex: 9998,
                    textAlign: 'center',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}>
                    {warning}
                </div>
            )}
            
            {/* Tab switch counter */}
            {tabSwitchCount > 0 && fullscreenActive && !showFullscreenPrompt && (
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    background: '#ffc107',
                    color: '#333',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    zIndex: 9997
                }}>
                    ⚠️ Warnings: {tabSwitchCount}/3
                </div>
            )}
            
            {/* Main content - dimmed if not in fullscreen */}
            <div style={{ 
                opacity: fullscreenActive ? 1 : 0.3,
                pointerEvents: fullscreenActive ? 'auto' : 'none'
            }}>
                {children}
            </div>
        </div>
    );
};

export default ProctoringWrapper;