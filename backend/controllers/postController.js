const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const { is } = require("express/lib/request");

// @desc    Create a post
// @route   POST /api/posts
// @access  Private

const publishPost = asyncHandler(async (req, res) => {
  const { title, body } = req.body;
  if (!title) {
    res.status(400);
    throw new Error("Please add a title");
  }
  const post = await Post.create({
    title,
    body: body ? body : "",
  });
  if (post) {
    res.status(201).json({
      _id: post.id,
      title: post.title,
      body: post.body,
    });
  } else {
    res.status(400);
    throw new Error("Invalid post data");
  }
});

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public

const getPosts = asyncHandler(async (req, res) => {
  // We could try sorting by date here but we'll do it on the frontend for now
  // Also, once we have a lot of posts it might be worth adding pagination
  const posts = await Post.find({});
  res.status(200).json(posts);
});

// @desc    Get post by ID
// @route   GET /api/posts
// @access  Public

const getPostById = asyncHandler(async (req, res) => {
  // We could try sorting by date here but we'll do it on the frontend for now
  // Also, once we have a lot of posts it might be worth adding pagination
  const post = await Post.findById(req.params.id);
  res.status(200).json(post);
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const editPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(400);
    throw new Error("Post not found");
  }

  // Make sure the logged in user matches the goal user
  // if (goal.user.toString() !== req.user.id) {
  //   res.status(401);
  //   throw new Error("User not authorized");
  // }

  const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedPost);
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(400);
    throw new Error("Post not found");
  }

  // Make sure the logged in user matches the goal user
  // if (goal.user.toString() !== req.user.id) {
  //   res.status(401);
  //   throw new Error("User not authorized");
  // }

  post.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  publishPost,
  getPosts,
  editPost,
  getPostById,
  deletePost,
};
