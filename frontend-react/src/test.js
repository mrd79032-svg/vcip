import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <div>
            <h1>Test - If you see this, React works</h1>
            <button onClick={() => alert('Working')}>Click</button>
        </div>
    </React.StrictMode>
);