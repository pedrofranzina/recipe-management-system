const { ObjectId } = require('mongodb');
const { getCollection } = require('../db/mongodb');

let collection;
(async () => {
    try {
        collection = await getCollection('recipes');
    } catch {
        collection = null;
    }
})();

async function index(req, res) {
    try {
        const recipes = await collection.find({}).toArray();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function show(req, res) {
    try {
        const recipe = await collection.findOne({ _id: new ObjectId(req.params.id) });
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function store(req, res) {
    try {
        const photo_path = req.file ? `/images/${req.file.filename}` : '';

        const result = await collection.insertOne({
            ...req.body,
            photo_path,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const newRecipe = await collection.findOne({ _id: result.insertedId });
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function update(req, res) {
    try {
        const recipe = await collection.findOne({ _id: new ObjectId(req.params.id) });
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const photo_path = req.file ? `/images/${req.file.filename}` : recipe.photo_path;

        await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    ...req.body,
                    photo_path,
                    updatedAt: new Date()
                }
            }
        );
        const updatedRecipe = await collection.findOne({ _id: new ObjectId(req.params.id) });
        res.json(updatedRecipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function destroy(req, res) {
    try {
        const recipe = await collection.findOne({ _id: new ObjectId(req.params.id) });
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        await collection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: 'Recipe deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    index,
    show,
    store,
    update,
    destroy
};