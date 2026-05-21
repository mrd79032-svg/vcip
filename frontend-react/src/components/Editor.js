import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';

const getExtension = (language) => {
    switch (language) {
        case 'python': return python();
        case 'java': return java();
        case 'cpp': return cpp();
        case 'javascript': return javascript();
        default: return python();
    }
};

function Editor({ code, onChange, language = 'python', readOnly = false }) {
    return (
        <CodeMirror
            value={code}
            height="400px"
            theme={dracula}
            extensions={[getExtension(language)]}
            onChange={onChange}
            readOnly={readOnly}
            basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                foldGutter: true,
                dropCursor: true,
                allowMultipleSelections: true,
                indentOnInput: true
            }}
        />
    );
}

export default Editor;