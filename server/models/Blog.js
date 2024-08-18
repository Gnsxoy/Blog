const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 实例化数据模版
const BlogSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  tagID: {
    type: String,
    required: true,
  },
  desc: String,
  isTop: {
    type: Boolean,
    default: false,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  updateDate: {
    type: Date,
    default: Date.now,
  }
});

module.exports = Blog = mongoose.model("blog", BlogSchema);
