const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateQuestion(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        
        const fullPrompt = `Create a coding interview question based on: "${prompt}"

Return ONLY valid JSON with these fields:
{
    "title": "Question title",
    "description": "Detailed problem description",
    "difficulty": "easy",
    "language": "python"
}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        return {
            title: prompt,
            description: `Write a solution for: ${prompt}`,
            difficulty: 'medium',
            language: 'python'
        };
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error('Failed to generate question');
    }
}

module.exports = { generateQuestion };