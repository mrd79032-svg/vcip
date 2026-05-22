const axios = require('axios');

async function generateRandomTests(question) {
    const config = question.randomTestConfig;
    if (!config || !config.enabled) return [];

    const tests = [];
    const count = config.count;
    const min = config.minValue ?? -100;
    const max = config.maxValue ?? 100;

    if (config.problemType === 'add_two_numbers') {
        for (let i = 0; i < count; i++) {
            const a = Math.floor(Math.random() * (max - min + 1)) + min;
            const b = Math.floor(Math.random() * (max - min + 1)) + min;
            const expected = (a + b).toString();
            const input = `${a} ${b}`;
            tests.push({ input, expected });
        }
    } else if (config.problemType === 'multiply_two_numbers') {
        for (let i = 0; i < count; i++) {
            const a = Math.floor(Math.random() * (max - min + 1)) + min;
            const b = Math.floor(Math.random() * (max - min + 1)) + min;
            const expected = (a * b).toString();
            const input = `${a} ${b}`;
            tests.push({ input, expected });
        }
    }
    return tests;
}

module.exports = { generateRandomTests };