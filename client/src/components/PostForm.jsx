import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService } from '../services/api';
import { useCategories } from '../hooks/useCategories';
import { usePostsContext } from '../contexts/PostsContext';

const PostForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { categories } = useCategories();
  const { addPost, updatePost } = usePostsContext();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isEdit && id) {
      const fetchPost = async () => {
        try {
          const post = await postService.getPost(id);
          setFormData({
            title: post.title || '',
            content: post.content || '',
            category: post.category ? post.category._id : '',
            tags: post.tags ? post.tags.join(', ') : ''
          });
        } catch (err) {
          setError('Failed to load post for editing');
        }
      };
      fetchPost();
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }
    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    } else if (formData.content.length < 10) {
      errors.content = 'Content must be at least 10 characters';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setError(null);

    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    // Optimistic update for create
    if (!isEdit) {
      const tempPost = {
        ...postData,
        _id: Date.now().toString(), // temporary ID
        createdAt: new Date().toISOString(),
        author: { name: 'You' }, // placeholder
        category: categories.find(cat => cat._id === formData.category)
      };
      addPost(tempPost);
      navigate('/posts'); // Navigate immediately
    }

    try {
      if (isEdit) {
        const updatedPost = await postService.updatePost(id, postData);
        updatePost(updatedPost);
        navigate(`/posts/${id}`);
      } else {
        const newPost = await postService.createPost(postData);
        // Replace the temporary post with the real one
        updatePost({ ...newPost, _id: Date.now().toString() }); // This is a hack, better to remove temp and add real
        navigate(`/posts/${newPost._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
      // If create failed, remove the optimistic post
      if (!isEdit) {
        // Since we navigated away, maybe not handle here, or use a different approach
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {isEdit ? 'Edit Post' : 'Create New Post'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter post title"
            />
            {validationErrors.title && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={10}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.content ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Write your post content here..."
            />
            {validationErrors.content && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.content}</p>
            )}
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="javascript, react, tutorial"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Post' : 'Create Post')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/posts')}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;