import React, { useState } from 'react';
import axios from 'axios';
import './OnlineCompiler.css';

const OnlineCompiler = () => {
    const [code, setCode] = useState(`// Welcome to VCIP Online Compiler
// Write your code here and click Run

function greet(name) {
    return "Hello, " + name + "!";
}

console.log(greet("Interview Candidate"));

// Try changing the code above!
`);
    const [language, setLanguage] = useState('javascript');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const languages = [
        { value: 'javascript', label: 'JavaScript (Node.js)' },
        { value: 'python', label: 'Python 3' },
        { value: 'java', label: 'Java' },
        { value: 'cpp', label: 'C++' },
        { value: 'c', label: 'C' },
        { value: 'csharp', label: 'C#' }
    ];

    const handleRunCode = async () => {
        if (!code.trim()) {
            setError('Please write some code first');
            return;
        }

        setLoading(true);
        setOutput('');
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login first');
                setLoading(false);
                return;
            }

            const response = await axios.post(
                'http://localhost:5000/api/compile/run',
                {
                    code: code,
                    language: language,
                    stdin: input
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setOutput(response.data.output || '✅ Code executed successfully (no output)');
                if (response.data.error) {
                    setError(response.data.error);
                }
            } else {
                setError(response.data.error || 'Execution failed');
            }
        } catch (err) {
            console.error('Compilation error:', err);
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else if (err.message === 'Network Error') {
                setError('Cannot connect to server. Make sure backend is running on port 5000');
            } else {
                setError('Failed to compile code. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setCode('');
        setOutput('');
        setError('');
        setInput('');
    };

    const getSampleCode = () => {
        const samples = {
            javascript: `// JavaScript Sample
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci of 10:", fibonacci(10));
console.log("Fibonacci of 5:", fibonacci(5));`,
            python: `# Python Sample
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print("Factorial of 5:", factorial(5))
print("Factorial of 10:", factorial(10))`,
            java: `// Java Sample
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        int sum = 0;
        for(int i = 1; i <= 10; i++) {
            sum += i;
        }
        System.out.println("Sum of 1 to 10: " + sum);
    }
}`,
            cpp: `// C++ Sample
#include <iostream>
using namespace std;

int main() {
    cout << "Hello from C++!" << endl;
    
    // Check if number is prime
    int num = 17;
    bool isPrime = true;
    
    for(int i = 2; i < num; i++) {
        if(num % i == 0) {
            isPrime = false;
            break;
        }
    }
    
    cout << num << " is " << (isPrime ? "" : "not ") << "prime" << endl;
    return 0;
}`,
            c: `// C Sample
#include <stdio.h>

int main() {
    printf("Hello from C!\\n");
    
    // Find maximum in array
    int arr[] = {5, 2, 8, 1, 9, 3};
    int max = arr[0];
    
    for(int i = 1; i < 6; i++) {
        if(arr[i] > max) {
            max = arr[i];
        }
    }
    
    printf("Maximum value: %d\\n", max);
    return 0;
}`,
            csharp: `// C# Sample
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello from C#!");
        
        // Calculate sum
        int sum = 0;
        for(int i = 1; i <= 10; i++) {
            sum += i;
        }
        Console.WriteLine($"Sum of 1 to 10: {sum}");
    }
}`
        };
        return samples[language] || samples.javascript;
    };

    const handleSample = () => {
        setCode(getSampleCode());
    };

    return (
        <div className="compiler-container">
            <div className="compiler-header">
                <h2>💻 Online Code Compiler</h2>
                <p>Write, compile and run your code directly in the browser</p>
            </div>

            <div className="compiler-controls">
                <div className="controls-group">
                    <label>Language:</label>
                    <select 
                        value={language} 
                        onChange={(e) => setLanguage(e.target.value)}
                        className="language-select"
                    >
                        {languages.map(lang => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="controls-group">
                    <button 
                        onClick={handleRunCode} 
                        disabled={loading}
                        className="run-btn"
                    >
                        {loading ? '⏳ Running...' : '▶ Run Code'}
                    </button>
                    <button onClick={handleSample} className="sample-btn">
                        📝 Sample Code
                    </button>
                    <button onClick={handleClear} className="clear-btn">
                        🗑 Clear All
                    </button>
                </div>
            </div>

            <div className="editor-section">
                <div className="editor-header">
                    <span>📝 Code Editor</span>
                    <span className="language-badge">{language.toUpperCase()}</span>
                </div>
                <textarea
                    className="code-editor"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Write your code here..."
                    spellCheck={false}
                />
            </div>

            <div className="input-section">
                <div className="section-header">
                    <span>⌨️ Standard Input (stdin)</span>
                </div>
                <textarea
                    className="input-area"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter input for your program (optional)..."
                    rows={3}
                />
            </div>

            <div className="output-section">
                <div className="section-header">
                    <span>📤 Output</span>
                </div>
                {loading && (
                    <div className="loading-indicator">
                        <div className="spinner"></div>
                        <span>Compiling and running your code...</span>
                    </div>
                )}
                {output && !loading && (
                    <pre className="output-area success">
                        {output}
                    </pre>
                )}
                {error && !loading && (
                    <pre className="output-area error">
                        ❌ Error:\n{error}
                    </pre>
                )}
                {!output && !error && !loading && (
                    <div className="output-placeholder">
                        Click "Run Code" to see output here
                    </div>
                )}
            </div>
        </div>
    );
};

export default OnlineCompiler;