const validateRegistration = (req, res, next) => {
    const { username, email, password, fullName } = req.body;
    const errors = [];

    if (!username || username.length < 3) {
        errors.push('Username must be at least 3 characters');
    }
    if (!email || !email.includes('@')) {
        errors.push('Valid email is required');
    }
    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }
    if (!fullName) {
        errors.push('Full name is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email || !email.includes('@')) {
        errors.push('Valid email is required');
    }
    if (!password) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    next();
};

const validateQuestion = (req, res, next) => {
    const { title, description } = req.body;
    const errors = [];

    if (!title || title.length < 5) {
        errors.push('Title must be at least 5 characters');
    }
    if (!description || description.length < 20) {
        errors.push('Description must be at least 20 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    next();
};

module.exports = {
    validateRegistration,
    validateLogin,
    validateQuestion
};