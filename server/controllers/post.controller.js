const { validationResult } = require('express-validator');
const PostService = require('../services/post.service');
const PostRepository = require('../repositories/post.repository');


class PostController {
  constructor() {
    this.postService = new PostService();
    this.postRepository = new PostRepository();

  }

  /**
   * Get all posts
   * @param req - the request object
   * @param res - the response object
   * @returns void
   */
  getPosts = async (req, res) => {
    const pageNo = parseInt(req.query.pageNo) || 1;
    const size = parseInt(req.query.size) || 10;

    try {
      const result = await this.postService.getPosts(pageNo, size);
      res.json(result);
    } catch (err) {
      this.handleDBError(err, res);
    }
  }

  /**
   * Save a post
   * @param req - the request object
   * @param res - the response object
   * @returns void
   */
  addPost = async (req, res) => {
    try {
      const { name, title, content } = JSON.parse(req.body.post);
      const image = req.file;
      const newPost = {
        name,
        title,
        content,
        image,
        createdBy: req.user._id,
      };

      const savedPost = await this.postService.addPost(newPost);
      res.json({ post: savedPost });
    } catch (err) {
      this.handleDBError(err, res);
    }
  }

  /**
   * Get a single post
   * @param req - the request object
   * @param res - the response object
   * @returns void
   */
  getPost = async (req, res) => {
    try {
      const post = await this.postRepository.findByCuid(req.params.cuid);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json({ post });
    } catch (err) {
      this.handleDBError(err, res);
    }
  }

  /**
   * Delete a post
   * @param req - the request object
   * @param res - the response object
   * @returns void
   */
  deletePost = async (req, res) => {
    try {
      const user = req.user;
      await this.postService.deletePost(req.params.cuid, user);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Handler for database errors
   * @param err - the error object
   * @param res - the response object
   * @returns void
   */
  handleDBError = (err, res) => {
    console.error(err);
    res.status(500).send(err);
  }
}

module.exports = PostController;
