import React from 'react';

const SimpleTest = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ color: 'green' }}>✅ TEST COMPONENT IS WORKING!</h1>
            <p>If you can see this and type in the textarea below, React is working fine.</p>
            <textarea 
                rows={10} 
                cols={80} 
                placeholder="Type here to test if typing works..."
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
            />
        </div>
    );
};

export default SimpleTest;