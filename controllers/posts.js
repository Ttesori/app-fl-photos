const Post = require('../models/Post');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

module.exports = {
  getDashboard: async (req, res) => {
    try {
      const posts = await Post.find({ user_id: req.user._id });

      res.render('posts/index.ejs', {
        title: 'User Dashboard',
        className: 'page-dashboard',
        user: req.user,
        posts: posts
      })
    } catch (err) {
      console.log(err)
    }
  },
  getPost: async (req, res) => {
    const id = req.params.id;

    const post = await Post.findOne({ _id: id }).lean();

    if (post._id) {
      res.render('posts/single.ejs', {
        title: post.title,
        className: 'page-single',
        user: req.user,
        post: post,
      })
    }
  },
  postPost: async (req, res) => {
    try {
      const filePath = req.files[0].path;
      cloudinary.uploader.upload(filePath,
        async (error, result) => {
          if (error) return res.status(500).send();
          //remove temp file
          fs.unlinkSync(filePath);

          let post = {
            title: req.body.title,
            body: req.body.body,
            link: result.url,
            public_id: result.public_id,
            user_id: req.user._id
          };
          let resp = await Post.create(post);
          if (resp._id) {
            res.status(200).send();
          }
        });
    } catch (err) {
      console.log(err)
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });

      res.render('posts/feed.ejs', {
        title: 'Feed',
        className: 'page-feed',
        user: req.user,
        posts: posts
      })
    } catch (err) {
      console.log(err)
    }
  },
  deletePost: async (req, res) => {
    try {
      let resp = await Post.findByIdAndDelete(req.body.id);
      cloudinary.uploader.destroy(resp.public_id, {}, (err, result) => {
        if (err) return res.status(500).send();
        res.redirect('/posts');
      });

    } catch (error) {

    }
  },
  likePost: async (req, res) => {
    const id = req.params.id;
    const newLikes = parseInt(req.body.likes) + 1;

    let result = await Post.findOneAndUpdate({ _id: id }, { likes: newLikes });

    if (result._id) {
      res.redirect(`/posts/${id}`);
    }

  },
}