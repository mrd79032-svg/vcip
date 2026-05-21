const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateQuestionFromPrompt(prompt) {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const fullPrompt = `Create a coding question based on: "${prompt}". Return JSON: { "title": "...", "description": "...", "difficulty": "easy/medium/hard", "language": "python" }`;
    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return { title: prompt, description: `Solve: ${prompt}`, difficulty: 'medium', language: 'python' };
}

module.exports = { generateQuestionFromPrompt };