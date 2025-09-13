import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Blog from "../models/blog.js";
import Comment from "../models/Comment.js";
import main from "../configs/gemini.js";

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(
      req.body.blog
    );
    const imageFile = req.file;

    //check if all fields are present
    if (!title || !description || !category || !imageFile) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    //upload image to imagekit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: `blog-image-${Date.now()}.jpg`,
      folder: "blogs",
    });

    //optimization through imagekit URL transformation
    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" },
      ],
    });

    const image = optimizedImageUrl;

    // Get author information from token
    let author = null;
    let authorName = "Admin";

    if (req.userId) {
      // User is logged in
      const User = (await import("../models/User.js")).default;
      const user = await User.findById(req.userId);
      if (user) {
        author = user._id;
        authorName = user.name;
      }
    }

    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished,
      author,
      authorName,
    });

    res.json({ success: true, message: "Blog added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//create api for blog lists(blog post) - now user-specific
export const getAllBlogs = async (req, res) => {
  try {
    // If admin (including main admin), show all published blogs
    if (req.userRole === 'admin' || req.isMainAdmin) {
      const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
      return res.json({ success: true, blogs });
    }

    // If regular authenticated user, show only their published blogs
    if (req.userId) {
      const blogs = await Blog.find({
        author: req.userId,
        isPublished: true,
      }).sort({ createdAt: -1 });
      return res.json({ success: true, blogs });
    }

    // If no user is logged in, return empty array (current behavior)
    return res.json({ success: true, blogs: [] });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//controller funct to get individual blog data
export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    //no blog means if we do not get any blog with this id
    if (!blog) {
      return res.json({ success: false, message: "Blog not Found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//controller funct to delte any blog and we need id for that
export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    await Blog.findByIdAndDelete(id);

    //Delete all comments associated with the blog
    await Comment.deleteMany({ blog: id });

    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//publish and unpublish blogs
export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    //now we have blog so for this blog we have to change the each published property , if its true then we'll make it false and if its false then we'll make it true
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ success: true, message: "Blog status Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//new comment in blogpost
export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;
    //statement to add new comment
    await Comment.create({ blog, name, content }); //new data in db
    res.json({ success: true, message: "Comment added for review" }); //it will go for review and admin can approve
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//comment data for individual blog that will be on frontend
export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;
    //we have to find comments on this blog
    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 }); //sort blog post wrt date
    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//now we will use gemini api for ai to make content of our blog
export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const content = await main(
      prompt + " Generate a blog content for this topic in simple text fromat "
    );
    res.json({ success: true, content });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get blogs by user (for user dashboard)
export const getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
