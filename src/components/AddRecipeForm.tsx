import React, { useState } from 'react';
import { Recipe } from '../types';
import { Plus, X, ChevronDown } from 'lucide-react';

interface AddRecipeFormProps {
  onAdd: (recipe: Omit<Recipe, 'id' | 'createdAt'>) => void;
}

export function AddRecipeForm({ onAdd }: AddRecipeFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    imageUrl: '',
    prepTime: 0,
    cookTime: 0,
    servings: 2,
    ingredients: [''],
    instructions: [''],
    cuisine: '',
    difficulty: 'medium' as Recipe['difficulty']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipe.title || !recipe.imageUrl) return;
    
    onAdd(recipe);
    setRecipe({
      title: '',
      description: '',
      imageUrl: '',
      prepTime: 0,
      cookTime: 0,
      servings: 2,
      ingredients: [''],
      instructions: [''],
      cuisine: '',
      difficulty: 'medium'
    });
    setIsOpen(false);
  };

  const addListItem = (list: 'ingredients' | 'instructions') => {
    setRecipe({
      ...recipe,
      [list]: [...recipe[list], '']
    });
  };

  const updateListItem = (list: 'ingredients' | 'instructions', index: number, value: string) => {
    const newList = [...recipe[list]];
    newList[index] = value;
    setRecipe({
      ...recipe,
      [list]: newList
    });
  };

  const removeListItem = (list: 'ingredients' | 'instructions', index: number) => {
    setRecipe({
      ...recipe,
      [list]: recipe[list].filter((_, i) => i !== index)
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-white rounded-xl shadow-sm p-4 text-center hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-center gap-2 text-gray-600 hover:text-orange-500">
          <Plus className="h-5 w-5" />
          <span className="font-medium">Add New Recipe</span>
        </div>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Recipe Title"
            value={recipe.title}
            onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
          />

          <textarea
            placeholder="Description"
            value={recipe.description}
            onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none h-24"
          />

          <input
            type="text"
            placeholder="Image URL"
            value={recipe.imageUrl}
            onChange={(e) => setRecipe({ ...recipe, imageUrl: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
          />

          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Prep Time (min)"
              value={recipe.prepTime || ''}
              onChange={(e) => setRecipe({ ...recipe, prepTime: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
            />
            <input
              type="number"
              placeholder="Cook Time (min)"
              value={recipe.cookTime || ''}
              onChange={(e) => setRecipe({ ...recipe, cookTime: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
            />
            <input
              type="number"
              placeholder="Servings"
              value={recipe.servings || ''}
              onChange={(e) => setRecipe({ ...recipe, servings: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Cuisine"
              value={recipe.cuisine}
              onChange={(e) => setRecipe({ ...recipe, cuisine: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
            />
            <select
              value={recipe.difficulty}
              onChange={(e) => setRecipe({ ...recipe, difficulty: e.target.value as Recipe['difficulty'] })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Ingredients</label>
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => updateListItem('ingredients', index, e.target.value)}
                  placeholder="Add ingredient"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeListItem('ingredients', index)}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem('ingredients')}
              className="text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              + Add Ingredient
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Instructions</label>
            {recipe.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={instruction}
                  onChange={(e) => updateListItem('instructions', index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeListItem('instructions', index)}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem('instructions')}
              className="text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              + Add Step
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Recipe
        </button>
      </div>
    </form>
  );
}