import React from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';

const Categories = () => {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Categories</h1>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No categories found.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div key={category._id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
              <p className="text-gray-600 mb-4">{category.description || 'No description'}</p>
              <Link
                to={`/posts?category=${category._id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                View Posts →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;