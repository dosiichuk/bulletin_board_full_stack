const Post = require('../models/post.model');
const User = require('../models/user.model');

exports.getAll = async (req, res, next) => {
  try {
    console.log(req.params, req.query);
    const posts = await Post.find({ status: { $eq: 'published' } })
      .populate('author', ['name', 'email', 'googleId'])
      .select('title content summary price photo publishedDate author location')
      .sort({ publishedDate: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getOneById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) res.status(404).json({ message: 'Not found' });
    else res.json({ data: post });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.createOne = async (req, res) => {
  try {
    console.log(req.body);
    const newPost = new Post(req.body);
    await newPost.save();
    const response = await Post.findById(newPost._id)
      .populate('author', ['name', 'email', 'googleId'])
      .select(
        'title content summary photo publishedDate author location price'
      );
    res.json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

exports.updateOne = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: { $eq: req.params.id } },
      { $set: { ...req.body } },
      { new: true }
    );
    const response = await Post.findById(post._id)
      .populate('author', ['name', 'email', 'googleId'])
      .select(
        'title content summary photo publishedDate author location price'
      );
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.deletOne = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      await Post.deleteOne({ _id: { $eq: req.params.id } });
      res.json({ message: 'OK', data: { post } });
    } else res.status(404).json({ message: 'Not found...' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.params.userId,
    });
    if (posts) {
      res.json({ message: 'OK', data: posts });
    } else res.status(404).json({ message: 'Not found...' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
