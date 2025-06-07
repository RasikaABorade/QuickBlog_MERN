//now we want to craeate api using that we can store the blog data in mongodb and store any data in mongo we need to create models

import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subTitle: { type: String },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    isPublished: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const Blog = mongoose.model("blog", blogSchema);

export default Blog; //tores data in db
