const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");

// add like
router.post("/", auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const { postId } = req.body;

        let post = await Post.findById(postId);
        if (!post)
            return res.json({
                msg: "Post doesn't exist",
            });

        const liked = await post.likes.find((like) => like.userId == userId);

        if (liked) {
            await post.likes.pull({
                userId: liked.userId,
                _id: liked._id,
            });
            await post.save();
            return res.json({ msg: "Post unliked", post });
        } else {
            await post.likes.push({
                userId,
            });
            await post.save();
            return res.json({
                msg: "Post liked",
                post,
            });
        }
    } catch (e) {
        return res.json({ e, msg: "Cannot like" });
    }
});

module.exports = router;
