import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';

const WebRTCVideo = ({ roomId, userId, isInterviewer }) => {
    const [socket, setSocket] = useState(null);
    const [peer, setPeer] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('Connecting...');
    const [remotePeerId, setRemotePeerId] = useState(null);
    
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const peerConnectionRef = useRef();

    // Initialize Socket.IO and PeerJS
    useEffect(() => {
        // Socket connection for signaling
        const newSocket = io('https://vcip-backend-utej.onrender.com');
        setSocket(newSocket);
        
        // Register user
        newSocket.emit('register-user', {
            userId: userId,
            role: isInterviewer ? 'interviewer' : 'candidate',
            roomId: roomId
        });
        
        // PeerJS connection
        const newPeer = new Peer(userId, {
            host: 'localhost',
            port: 9000,
            path: '/peerjs'
        });
        setPeer(newPeer);
        
        // Get user media (camera + microphone)
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
                setConnectionStatus('Ready');
            })
            .catch(err => {
                console.error('Camera access error:', err);
                setConnectionStatus('Camera/Mic access denied');
            });
        
        // Handle incoming calls
        newPeer.on('call', (call) => {
            if (localStream) {
                call.answer(localStream);
                call.on('stream', (remoteStream) => {
                    setRemoteStream(remoteStream);
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream;
                        setConnectionStatus('Connected');
                    }
                });
            }
        });
        
        // Socket event listeners
        newSocket.on('user-joined', (data) => {
            setRemotePeerId(data.userId);
            callUser(data.userId);
        });
        
        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            if (peer) peer.destroy();
            if (newSocket) newSocket.disconnect();
        };
    }, [roomId, userId, isInterviewer]);
    
    const callUser = (peerId) => {
        if (localStream) {
            const call = peer.call(peerId, localStream);
            call.on('stream', (remoteStream) => {
                setRemoteStream(remoteStream);
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remoteStream;
                    setConnectionStatus('Connected');
                }
            });
        }
    };
    
    const toggleMute = () => {
        if (localStream) {
            const newMuteState = !isMuted;
            localStream.getAudioTracks().forEach(track => track.enabled = !newMuteState);
            setIsMuted(newMuteState);
            socket.emit('toggle-mute', { roomId: roomId, muted: newMuteState });
        }
    };
    
    const toggleVideo = () => {
        if (localStream) {
            const newVideoState = !isVideoOff;
            localStream.getVideoTracks().forEach(track => track.enabled = !newVideoState);
            setIsVideoOff(newVideoState);
            socket.emit('toggle-video', { roomId: roomId, videoOff: newVideoState });
        }
    };
    
    const startScreenShare = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const screenTrack = screenStream.getVideoTracks()[0];
            
            // Get video sender from peer connection
            const senders = peerConnectionRef.current?.getSenders();
            const videoSender = senders?.find(s => s.track?.kind === 'video');
            if (videoSender) {
                videoSender.replaceTrack(screenTrack);
                setIsScreenSharing(true);
                setLocalStream(screenStream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = screenStream;
                }
                
                screenTrack.onended = () => {
                    stopScreenShare();
                };
            }
        } catch (err) {
            console.error('Screen share failed:', err);
        }
    };
    
    const stopScreenShare = async () => {
        try {
            const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const cameraTrack = cameraStream.getVideoTracks()[0];
            
            const senders = peerConnectionRef.current?.getSenders();
            const videoSender = senders?.find(s => s.track?.kind === 'video');
            if (videoSender) {
                videoSender.replaceTrack(cameraTrack);
                setIsScreenSharing(false);
                setLocalStream(cameraStream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = cameraStream;
                }
            }
        } catch (err) {
            console.error('Stop screen share failed:', err);
        }
    };
    
    return (
        <div className="webrtc-container" style={{ background: '#2d2d2d', borderRadius: '10px', padding: '15px' }}>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {/* Local Video */}
                <div style={{ flex: 1 }}>
                    <div style={{ position: 'relative' }}>
                        <video 
                            ref={localVideoRef} 
                            autoPlay 
                            muted 
                            playsInline 
                            style={{ width: '100%', height: '200px', background: '#000', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <span style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                            {isInterviewer ? 'Interviewer' : 'Candidate'}
                        </span>
                    </div>
                </div>
                
                {/* Remote Video */}
                <div style={{ flex: 1 }}>
                    <div style={{ position: 'relative' }}>
                        <video 
                            ref={remoteVideoRef} 
                            autoPlay 
                            playsInline 
                            style={{ width: '100%', height: '200px', background: '#000', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <span style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                            {isInterviewer ? 'Candidate' : 'Interviewer'}
                        </span>
                        <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: `rgba(0,0,0,0.6)`, padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>
                            {connectionStatus}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Control Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '15px' }}>
                <button 
                    onClick={toggleMute} 
                    style={{ 
                        padding: '10px 20px', 
                        background: isMuted ? '#dc3545' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    {isMuted ? '🔴 Unmute' : '🎤 Mute'}
                </button>
                
                <button 
                    onClick={toggleVideo} 
                    style={{ 
                        padding: '10px 20px', 
                        background: isVideoOff ? '#dc3545' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    {isVideoOff ? '📷 Start Video' : '📷 Stop Video'}
                </button>
                
                {!isInterviewer && (
                    <button 
                        onClick={isScreenSharing ? stopScreenShare : startScreenShare} 
                        style={{ 
                            padding: '10px 20px', 
                            background: isScreenSharing ? '#dc3545' : '#17a2b8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        {isScreenSharing ? '🛑 Stop Sharing' : '🖥 Share Screen'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default WebRTCVideo;