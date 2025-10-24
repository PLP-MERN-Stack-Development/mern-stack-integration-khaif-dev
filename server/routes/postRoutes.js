const express = require ('express');
const router = express.Router();
const asyncWrapper = require('../middleware/asyncWrapper')
const Post = require('../models/Post');
const NotFoundError = require('../middleware/error-handler');
const {query, validationResult} = require('express-validator');
const { postValidationRules, validatePost } = require('../middleware/validator');


// get all post
router.get('/', asyncWrapper( async (req, res) => {
    const posts = await Post.find();
    if(!posts) throw new NotFoundError('Posts Not Found');
    res.status(200).json(posts)
}));

// get post by id
// findById only take the id value not document: findById(re.params.id)
// findOne must specify the parameter to use to find as an object: findOne({req.params.id/email/phone number})
router.get('/:id', asyncWrapper(async (req,res) => {
    const targetPost = await Post.findById(req.params.id)
    if(!targetPost) {
        throw new NotFoundError('Post Not Found');
    }
    res.status(200).json(targetPost);
}));

// Create post
router.post('/', postValidationRules, validatePost, asyncWrapper(async (req, res) => {
  const newPost = new Post(req.body);
  const savedPost = await newPost.save();

  res.status(201).json({
    message: 'Post created successfully',
    post: savedPost
  });
}));


// update post
router.put('/:id', postValidationRules,validatePost, asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    req.body, 
    { new: true, runValidators: true }
  );

  if (!updatedPost) {
    throw new NotFoundError('Post not found');
  }

  res.status(200).json({
    message: 'Post updated successfully',
    post: updatedPost
  });
}));

// delete post
router.delete('/:id', asyncWrapper(async (req, res) => {  
  const deletedPost = await Post.findByIdAndDelete(req.params.id);

  if (!deletedPost) {
    throw new NotFoundError('Post not found');
  }

  res.status(200).json({
    message: `${deletedPost.title} deleted successfully`,
  });
}));

module.exports = router;



