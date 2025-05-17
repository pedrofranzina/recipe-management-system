const { getCollection } = require('../db/mongodb');

async function createSubscription(req, res) {
    try {
        const { name, email } = req.body;
        const collection = await getCollection('subscriptions');

        const existingSubscription = await collection.findOne({ email });
        if (existingSubscription) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }

        const subscription = {
            name,
            email,
            createdAt: new Date()
        };

        await collection.insertOne(subscription);
        res.status(201).json({ message: 'Subscription successful', subscription });
    } catch (error) {
        res.status(500).json({ message: 'Error creating subscription', error: error.message });
    }
}

module.exports = {
    createSubscription
}; 