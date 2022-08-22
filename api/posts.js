const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");

//Add post localhost:3000/posts
router.post("/", auth, (req, res) => {
    const { title, description } = req.body;
    const post = new Post({
        title,
        description,
        author: req.user._id,
    });
    post.save();
    return res.json({
        msg: "Post added succesfully",
        post,
    });
});

//Get all posts localhost:3000/posts
router.get("/", async (req, res) => {
    try {
        let posts = await Post.find({});
        if (!posts.length)
            return res.json({
                msg: "No posts found",
            });

        return res.send(posts);
    } catch (e) {
        return res.json({
            e,
            msg: "Cannot get posts",
        });
    }
});

//Get post by id localhost:3000/id
router.get("/:id", async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post)
            return res.json({
                msg: "No post found",
            });
        return res.json(post);
    } catch (e) {
        return res.json({
            e,
            msg: "Cannot get post",
        });
    }
});

//Delete post by id localhost:3000/posts/id
router.delete("/:id", auth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post)
            return res.json({
                msg: "Can't delete this post",
            });
        if (post.author != req.user._id)
            return res.json({
                msg: "Post can't be deleted",
            });
        let newpost = await Post.findByIdAndDelete(req.params.id);
        return res.json(newpost);
    } catch (e) {
        return res.json({
            e,
            msg: "Cannot get post",
        });
    }
    //Check if the req.user._id is equal to the author of the post
});

//Update post by id localhost:3000/posts/id
router.put("/:id", auth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post)
            return res.json({
                msg: "Can't update this post",
            });
        if (post.author != req.user._id)
            return res.json({
                msg: "You are not the author of this post, cant be updated",
            });
        let newpost = await Post.findByIdAndUpdate(req.params.id, req.body);
        return res.json(newpost);
    } catch (e) {
        return res.json({
            e,
            msg: "Cannot get post",
        });
    }
});

module.exports = router;
