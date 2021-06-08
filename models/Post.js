const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true
  },
  public_id: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);