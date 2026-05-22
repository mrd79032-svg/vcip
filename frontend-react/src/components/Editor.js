import React from 'react';

function Editor({ code, onChange, language = 'python', readOnly = false }) {
    return (
        <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            readOnly={readOnly}
            className="form-control font-monospace"
            style={{
                fontFamily: 'monospace',
                fontSize: '14px',
                minHeight: '400px',
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4',
                padding: '15px'
            }}
            placeholder={`Write your ${language} code here...`}
            onCopy={(e) => {
                if (!readOnly) {
                    e.preventDefault();
                    alert('Copy is disabled during interview!');
                }
            }}
            onPaste={(e) => {
                if (!readOnly) {
                    e.preventDefault();
                    alert('Paste is disabled during interview!');
                }
            }}
        />
    );
}

export default Editor;