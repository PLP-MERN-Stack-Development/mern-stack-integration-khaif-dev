const express = require ('express');
const router = express.Router();
const asyncWrapper = require('../middleware/asyncWrapper');
const Category = require('../models/Category');
const NotFoundError = require('../middleware/error-handler')

router.get('/', asyncWrapper( async( req, res) => {
    const categories = await Category.find();
    if(!categories) throw new NotFoundError('No Category Found');
    res.status(200).json(categories);
}));

router.post('/', asyncWrapper(async (req,res) => {
    const newCategory = await new Category(req.body).save();
    res.status(201).json(newCategory)
}));

module.exports = router;
// ### Task 2: Back-End Development
// - Design and implement a RESTful API for a blog application with the following endpoints:
//   - `GET /api/posts`: Get all blog posts
//   - `GET /api/posts/:id`: Get a specific blog post
//   - `POST /api/posts`: Create a new blog post
//   - `PUT /api/posts/:id`: Update an existing blog post
//   - `DELETE /api/posts/:id`: Delete a blog post
//   - `GET /api/categories`: Get all categories
//   - `POST /api/categories`: Create a new category
// - Create Mongoose models for `Post` and `Category` with proper relationships
// - Implement input validation using a library like Joi or express-validator
// - Add error handling middleware for API routes