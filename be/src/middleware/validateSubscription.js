const validateSubscription = (req, res, next) => {
    const { name, email } = req.body;
    const errors = [];

    // Validate name
    if (!name || name.trim() === '') {
        errors.push('Name is required');
    }

    // Validate email
    if (!email || email.trim() === '') {
        errors.push('Email is required');
    } else {
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Invalid email format');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Validation failed',
            errors
        });
    }
    next();
};

module.exports = validateSubscription; 