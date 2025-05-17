const express = require('express');
const router = express.Router();

// Import controllers
const { index, show, store, update, destroy } = require('../controllers/recipeController');
const { toggleFavorite, getUserFavorites, checkFavoriteStatus } = require('../controllers/favoriteController');
const { register, login } = require('../controllers/authController');
const { createSubscription } = require('../controllers/subscriptionController');

// Import middleware
const { validateRecipe } = require('../middleware/recipeValidation');
const validateSubscription = require('../middleware/validateSubscription');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Recipe routes
router.get('/recipes', index);
router.get('/recipes/:id', show);
router.post('/recipes', upload.single('photo'), validateRecipe, store);
router.put('/recipes/:id', upload.single('photo'), validateRecipe, update);
router.delete('/recipes/:id', destroy);

// Favorite routes (all require authentication)
router.use('/favorites', authenticateToken);
router.post('/favorites/toggle/:recipeId', toggleFavorite);
router.get('/favorites', getUserFavorites);
router.get('/favorites/check/:recipeId', checkFavoriteStatus);

// Subscription route
router.post('/subscribe', validateSubscription, createSubscription);

module.exports = router;
