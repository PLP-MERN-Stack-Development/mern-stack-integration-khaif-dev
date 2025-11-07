const express = require ('express');
const router = express.Router();
const asyncWrapper = require('../middleware/asyncWrapper')
const Post = require('../models/Post');
const NotFoundError = require('../middleware/error-handler');
const {query, validationResult} = require('express-validator');
const { postValidationRules, validatePost } = require('../middleware/validator');
const authenticate = require('../middleware/auth');
const upload = require('../middleware/upload');


// get all post with pagination, search, and filtering
router.get('/', asyncWrapper( async (req, res) => {
    const { page = 1, limit = 10, category, search, sort = '-createdAt' } = req.query;

    // Build query
    let query = {};

    // Filter by category if provided
    if (category) {
        query.category = category;
    }

    // Search in title and content if search query provided
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } }
        ];
    }

    // Get total count for pagination
    const total = await Post.countDocuments(query);

    // Get posts with pagination
    const posts = await Post.find(query)
        .populate('author', 'username')
        .populate('category', 'name')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit);

    if(!posts) throw new NotFoundError('Posts Not Found');

    res.status(200).json({
        posts,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalPosts: total
    });
}));

// get post by id
// findById only take the id value not document: findById(re.params.id)
// findOne must specify the parameter to use to find as an object: findOne({req.params.id/email/phone number})
router.get('/:id', asyncWrapper(async (req,res) => {
    const targetPost = await Post.findById(req.params.id)
        .populate('author', 'username')
        .populate('category', 'name')
        .populate('comments.user', 'username');

    if(!targetPost) {
        throw new NotFoundError('Post Not Found');
    }

    // Increment view count
    await targetPost.incrementViewCount();

    res.status(200).json(targetPost);
}));

// Create post with image upload
router.post('/', authenticate, upload.single('featuredImage'), postValidationRules, validatePost, asyncWrapper(async (req, res) => {
  const postData = { ...req.body };

  // Add image path if uploaded
  if (req.file) {
    postData.featuredImage = req.file.filename;
  }

  // Set author from authenticated user
  postData.author = req.user._id;

  const newPost = new Post(postData);
  const savedPost = await newPost.save();

  // Populate author and category for response
  await savedPost.populate('author', 'username');
  await savedPost.populate('category', 'name');

  res.status(201).json({
    message: 'Post created successfully',
    post: savedPost
  });
}));


// update post with image upload
router.put('/:id', authenticate, upload.single('featuredImage'), postValidationRules, validatePost, asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const postData = { ...req.body };

  // Add image path if uploaded
  if (req.file) {
    postData.featuredImage = req.file.filename;
  }

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    postData,
    { new: true, runValidators: true }
  );

  if (!updatedPost) {
    throw new NotFoundError('Post not found');
  }

  // Populate author and category for response
  await updatedPost.populate('author', 'username');
  await updatedPost.populate('category', 'name');

  res.status(200).json({
    message: 'Post updated successfully',
    post: updatedPost
  });
}));

// delete post
router.delete('/:id', authenticate, asyncWrapper(async (req, res) => {
  const deletedPost = await Post.findByIdAndDelete(req.params.id);

  if (!deletedPost) {
    throw new NotFoundError('Post not found');
  }

  res.status(200).json({
    message: `${deletedPost.title} deleted successfully`,
  });
}));

// Add comment to post
router.post('/:id/comments', authenticate, asyncWrapper(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Comment content is required' });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    throw new NotFoundError('Post not found');
  }

  post.comments.push({
    user: req.user._id,
    content: content
  });

  await post.save();

  // Populate comment user for response
  await post.populate('comments.user', 'username');

  res.status(201).json({
    message: 'Comment added successfully',
    post: post
  });
}));

module.exports = router;



