const axios = require('axios');

async function executeCode(source_code, language, stdin = '') {
    try {
        const languageMap = {
            'javascript': 'node',
            'python': 'python',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c'
        };

        const pistonLang = languageMap[language] || 'python';

        const response = await axios.post('http://localhost:2000/api/v2/execute', {
            language: pistonLang,
            version: '*',
            files: [{ content: source_code }],
            stdin: stdin
        });

        return {
            success: true,
            output: response.data.run?.output || 'No output',
            error: response.data.run?.stderr || '',
            cpuTime: response.data.run?.time
        };
    } catch (error) {
        console.error('Piston error:', error.response?.data || error.message);
        return {
            success: false,
            error: 'Error: ' + (error.response?.data?.message || error.message)
        };
    }
}

module.exports = { executeCode };