const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');
const { ensureAuth } = require('../middleware/auth');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get('/', ensureAuth, postsController.getDashboard);
router.post('/', ensureAuth, upload.array("file"), postsController.postPost);
router.delete('/', ensureAuth, postsController.deletePost);
router.get('/all', postsController.getAllPostsJSON);
router.get('/feed', postsController.getFeed);
router.get('/:id', postsController.getPost);
router.post('/:id/like', ensureAuth, postsController.likePost);

module.exports = router;