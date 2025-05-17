function validateRecipe(req, res, next) {
    const { name, ingredients, difficulty, time, steps, type } = req.body;

    const validationErrors = [];
    const allowedDifficulties = ['easy', 'medium', 'hard'];

    const parsedIngredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
    const parsedSteps = typeof steps === 'string' ? JSON.parse(steps) : steps;
    const parsedType = typeof type === 'string' ? JSON.parse(type) : type;

    if (!name) validationErrors.push('name is required');
    if (!Array.isArray(parsedIngredients) || parsedIngredients.length === 0) validationErrors.push('ingredients must be a non-empty array');
    if (!allowedDifficulties.includes(difficulty)) validationErrors.push(`difficulty must be one of: ${allowedDifficulties.join(', ')}`);
    if (!time) validationErrors.push('time is required');
    if (!Array.isArray(parsedSteps) || parsedSteps.length === 0) validationErrors.push('steps must be a non-empty array');
    if (!Array.isArray(parsedType) || parsedType.length === 0) validationErrors.push('type must be a non-empty array');

    if (validationErrors.length > 0) {
        return res.status(400).json({
            error: 'Validation failed',
            details: validationErrors
        });
    }

    req.body.ingredients = parsedIngredients;
    req.body.steps = parsedSteps;
    req.body.type = parsedType;

    next();
}

module.exports = { validateRecipe };