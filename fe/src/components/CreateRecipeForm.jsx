import { useState } from 'react';
import { useLocation } from 'wouter';
import recipeManagementService from '../services/recipeManagementService';

function CreateRecipeForm() {
    const [, setLocation] = useLocation();
    const [formData, setFormData] = useState({
        name: '',
        ingredients: [''],
        difficulty: 'easy',
        time: '',
        steps: [''],
        type: ['']
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');

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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();

            // Append all form fields
            Object.keys(formData).forEach(key => {
                if (Array.isArray(formData[key])) {
                    // Filter out empty values from arrays
                    const filteredArray = formData[key].filter(item => item.trim() !== '');
                    formDataToSend.append(key, JSON.stringify(filteredArray));
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Append the file if one was selected
            if (selectedFile) {
                formDataToSend.append('photo', selectedFile);
            }

            await recipeManagementService.createRecipe(formDataToSend);
            setMessage('Recipe created successfully!');
            setTimeout(() => {
                setLocation('/recipes');
            }, 2000);
        } catch (error) {
            setMessage(error.message || 'Error creating recipe. Please try again.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6 text-center">Create New Recipe</h2>
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
                        className="mt-2 px-4 py-2 bg-[#D2B48C] text-white rounded-lg hover:bg-[#C19A6B]"
                    >
                        Add Ingredient
                    </button>
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
                    <label className="block text-sm font-medium mb-2">Time Required</label>
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
                        className="mt-2 px-4 py-2 bg-[#D2B48C] text-white rounded-lg hover:bg-[#C19A6B]"
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
                                placeholder="e.g., Breakfast, Dessert"
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
                        className="mt-2 px-4 py-2 bg-[#D2B48C] text-white rounded-lg hover:bg-[#C19A6B]"
                    >
                        Add Type
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Recipe Photo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 rounded-lg border-2 border-[#D2B48C] focus:outline-none focus:ring-2 focus:ring-[#D2B48C]"
                    />
                    {selectedFile && (
                        <p className="mt-2 text-sm text-gray-600">
                            Selected file: {selectedFile.name}
                        </p>
                    )}
                </div>

                <div className="flex justify-center gap-4">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-[#D2B48C] text-white rounded-lg hover:bg-[#C19A6B] font-semibold"
                    >
                        Create Recipe
                    </button>
                    <button
                        type="button"
                        onClick={() => setLocation('/recipes')}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateRecipeForm; 