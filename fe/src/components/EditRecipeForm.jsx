import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import recipeService from '../services/recipeService';
import recipeManagementService from '../services/recipeManagementService';

function EditRecipeForm() {
    const [, params] = useRoute("/edit-recipe/:id");
    const [, setLocation] = useLocation();
    const [formData, setFormData] = useState({
        name: '',
        ingredients: [''],
        difficulty: 'easy',
        time: '',
        steps: [''],
        type: [''],
        photo_path: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        async function fetchRecipe() {
            try {
                const data = await recipeService.getRecipeById(params.id);
                setFormData({
                    name: data.name,
                    ingredients: data.ingredients,
                    difficulty: data.difficulty,
                    time: data.time,
                    steps: data.steps,
                    type: data.type,
                    photo_path: data.photo_path
                });
            } catch (error) {
                setMessage('Error loading recipe: ' + error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchRecipe();
    }, [params.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleArrayChange = (field, index, value) => {
        setFormData(prev => {
            const newArray = [...prev[field]];
            newArray[index] = value;
            return {
                ...prev,
                [field]: newArray
            };
        });
    };

    const addArrayField = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayField = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();

            // Validate required fields
            if (!formData.name.trim()) {
                throw new Error('Recipe name is required');
            }
            if (!formData.time.trim()) {
                throw new Error('Time is required');
            }
            if (formData.ingredients.filter(i => i.trim()).length === 0) {
                throw new Error('At least one ingredient is required');
            }
            if (formData.steps.filter(s => s.trim()).length === 0) {
                throw new Error('At least one step is required');
            }
            if (formData.type.filter(t => t.trim()).length === 0) {
                throw new Error('At least one type is required');
            }

            // Append all form fields
            Object.keys(formData).forEach(key => {
                if (Array.isArray(formData[key])) {
                    // Filter out empty values from arrays
                    const filteredArray = formData[key].filter(item => item.trim() !== '');
                    formDataToSend.append(key, JSON.stringify(filteredArray));
                } else if (key !== 'photo_path') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Append the file if one was selected
            if (selectedFile) {
                formDataToSend.append('photo', selectedFile);
            }

            await recipeManagementService.updateRecipe(params.id, formDataToSend);
            setMessage('Recipe updated successfully!');
            setTimeout(() => {
                setLocation(`/recipe/${params.id}`);
            }, 2000);
        } catch (error) {
            setMessage(error.message || 'Error updating recipe. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-2xl text-[#D2B48C]">Loading recipe...</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6 text-center">Edit Recipe</h2>
            {message && (
                <div className={`mb-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Recipe Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border-2 border-[#D2B48C] focus:outline-none focus:ring-2 focus:ring-[#D2B48C]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border-2 border-[#D2B48C] focus:outline-none focus:ring-2 focus:ring-[#D2B48C]"
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Time (in minutes)</label>
                    <input
                        type="text"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        placeholder="e.g., 30 minutes"
                        className="w-full px-4 py-2 rounded-lg border-2 border-[#D2B48C] focus:outline-none focus:ring-2 focus:ring-[#D2B48C]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Ingredients</label>
                    {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={ingredient}
                                onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                                required
                                className="flex-1 px-4 py-2 rounded-lg border-2 border-[#D2B48C] focus:outline-none focus:ring-2 focus:ring-[#D2B48C]"
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayField('ingredients', index)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayField('ingredients')}
                        className="mt-2 px-4 py-2 bg-[#D2B48C] text-white rounded-lg hover:bg-[#C4A484]"
                    >
                        Add Ingredient
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Steps</label>
                    {formData.steps.map((step, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={step}
                                onChange={(e) => handleArrayChange('steps', index, e.target.value)}
                                required
                                className="flex-1 px-4 py-2 rounded-lg border-2 border-[#D2B48C] focus:outline-none focus:ring-2 focus:ring-[#D2B48C]"
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayField('steps', index)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayField('steps')}
                        className="mt-2 px-4 py-2 bg-[#D2B48C] text-white rounded-lg hover:bg-[#C4A484]"
                    >
                        Add Step
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    {formData.type.map((type, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={type}
                                onChange={(e) => handleArrayChange('type', index, e.target.value)}
                                required
                                className="flex-1 px-4 py-2 rounded-lg border-2 border-[#D2B48C] focus:outline-none focus:ring-2 focus:ring-[#D2B48C]"
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayField('type', index)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayField('type')}
                        className="mt-2 px-4 py-2 bg-[#D2B48C] text-white rounded-lg hover:bg-[#C4A484]"
                    >
                        Add Type
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full px-6 py-3 bg-[#D2B48C] text-white rounded-lg font-semibold hover:bg-[#C4A484] transition-colors"
                >
                    Update Recipe
                </button>
            </form>
        </div>
    );
}

export default EditRecipeForm; 