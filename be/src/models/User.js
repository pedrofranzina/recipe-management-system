const { ObjectId } = require('mongodb');
const { getCollection } = require('../db/mongodb');

const createUser = async (username, email, password, role) => {
    try {
        const collection = await getCollection('users');

        // Check if username already exists
        const existingUsername = await collection.findOne({ username });
        if (existingUsername) {
            throw new Error('Username already exists');
        }

        // Check if email already exists
        const existingEmail = await collection.findOne({ email });
        if (existingEmail) {
            throw new Error('Email already exists');
        }

        // Create new user
        const userData = {
            username,
            email,
            password,
            role,
            createdAt: new Date()
        };

        const result = await collection.insertOne(userData);

        // Verify user was created
        const createdUser = await collection.findOne({ _id: result.insertedId });

        return result.insertedId;
    } catch (error) {
        throw error;
    }
};

const findUserByUsername = async (username) => {
    try {
        const collection = await getCollection('users');
        const user = await collection.findOne({ username });
        return user;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createUser,
    findUserByUsername
}; 