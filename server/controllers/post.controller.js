const { validationResult } = require('express-validator');
const Post = require('../models/post');
const cuid = require('cuid');
const slug = require('limax');
const sanitizeHtml = require('sanitize-html');

// Handler for database errors
const handleDBError = (err, res) => {
  console.error(err);
  res.status(500).send(err);
};

/**
 * Get all posts
 * @param req - the request object
 * @param res - the response object
 * @returns void
 */
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort('-dateAdded').exec();
    res.json({ posts });
  } catch (err) {
    handleDBError(err, res);
  }
};

/**
 * Save a post
 * @param req - the request object
 * @param res - the response object
 * @returns void
 */
const addPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, title, content } = req.body.post;

  const newPost = new Post(req.body.post);

  // Let's sanitize inputs
  newPost.title = sanitizeHtml(title);
  newPost.name = sanitizeHtml(name);
  newPost.content = sanitizeHtml(content);

  newPost.slug = slug(title.toLowerCase(), { lowercase: true });
  newPost.cuid = cuid();

  try {
    const saved = await newPost.save();
    res.json({ post: saved });
  } catch (err) {
    handleDBError(err, res);
  }
};

/**
 * Get a single post
 * @param req - the request object
 * @param res - the response object
 * @returns void
 */
const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ cuid: req.params.cuid }).exec();
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ post });
  } catch (err) {
    handleDBError(err, res);
  }
};


/**
 * Delete a post
 * @param req - the request object
 * @param res - the response object
 * @returns void
 */
const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ cuid: req.params.cuid }).exec();
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    await post.remove();
    res.status(200).end();
  } catch (err) {
    handleDBError(err, res);
  }
};

module.exports = {
  getPosts,
  addPost,
  getPost,
  deletePost
};
