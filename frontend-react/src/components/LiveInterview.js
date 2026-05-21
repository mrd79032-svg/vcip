import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Editor from './Editor';

function LiveInterview() {
    const { id } = useParams();
    const [code, setCode] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);
        newSocket.emit('join-interview', id);
        newSocket.on('code-update', (updatedCode) => setCode(updatedCode));
        return () => newSocket.disconnect();
    }, [id]);

    return (
        <div>
            <h3>Live Interview - Watching Candidate</h3>
            <Editor code={code} onChange={() => {}} language="python" readOnly={true} />
        </div>
    );
}

export default LiveInterview;