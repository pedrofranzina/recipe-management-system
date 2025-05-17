const { MongoClient } = require('mongodb')

const url = process.env.MONGODB_URL
const dbName = 'final_project'

const client = new MongoClient(url)

async function connect() {
    try {
        await client.connect()
        return client.db(dbName)
    } catch (error) {
        throw error
    }
}

async function getDb() {
    try {
        return client.db(dbName)
    } catch (error) {
        throw error
    }
}

async function getCollection(collectionName) {
    try {
        const db = await getDb()
        return db.collection(collectionName)
    } catch (error) {
        throw error
    }
}

connect()

module.exports = {
    client,
    getDb,
    getCollection
}
