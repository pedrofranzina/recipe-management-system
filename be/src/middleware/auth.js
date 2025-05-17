const jwt = require('jsonwebtoken');
const { findUserByUsername } = require('../models/User');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

async function isAdmin(req, res, next) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(401).json({ message: 'Username and password are required' });
        }

        const user = await findUserByUsername(username);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Authentication error', error: error.message });
    }
};

module.exports = {
    isAdmin,
    authenticateToken
}; 