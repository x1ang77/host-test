// const express = require('express')
// const router = express.Router()
// const Post = require('../models/Post')
// const auth = require('../middleware/auth')

// router.post('/', auth, async (res, req) => {
//     try {
//         const {
//             postId,
//             message
//         } = req.body;​

//         let post = await Post.findById(postId);

//         const userId = req.user._id;​

//         if (post.length == 0) return res.json({
//             msg: "No post found"
//         });​

//         const commenters = post.comments.find(comments => comments.userId == userId);​

//     } catch (e) {
//         return res.json({
//             e,
//             msg: "Cannot comment on post"
//         });
//     }
// })
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Post = require("../models/Post");
const User = require("../models/User");
router.post("/", auth, async (req, res) => {
    try {
        const { postId, comment } = req.body;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        if (!post)
            return res.json({
                msg: "no posts found",
            });
        post.comments.push({
            postId,
            comment,
            userId,
        });
        post.save();
        return res.json({
            post,
            msg: "Comment added successfully",
        });
    } catch (e) {
        return res.status(400).json({
            msg: "Cannot make a comment",
        });
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const { commentId } = req.body;
        if (commentId.length == 0)
            return res.json({
                msg: "CommentId cannot be empty",
            });
        const post = await Post.findById(req.params.id);
        if (!post)
            return res.json({
                msg: "Post not found",
            });
        const hasComment = post.comments.find(
            (comment) => comment._id == commentId
        );
        if (!hasComment)
            return res.json({
                msg: "Comment not found",
            });
        if (hasComment.userId == req.user._id) {
            post.comments.pull(commentId);
            await post.save();
            return res.json({
                post,
                msg: "Comment deleted",
            });
        } else {
            return res.json("Not the author of comment");
        }
    } catch (e) {
        return res.json({
            e,
            msg: "Cannot add comment",
        });
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const { commentId, comment } = req.body;
        if (commentId.length == 0)
            return res.json({
                msg: "CommentId cannot be empty",
            });
        if (comment.length == 0)
            return res.json({
                msg: "Comment cannot be empty",
            });
        const post = await Post.findById(req.params.id);
        if (!post)
            return res.json({
                msg: "Post not found",
            });
        const hasComment = post.comments.find(
            (comment) => comment._id == commentId
        );
        if (!hasComment)
            return res.json({
                msg: "Comment not found",
            });
        if (hasComment.userId == req.user._id) {
            hasComment.comment = comment;
            await post.save();
            return res.json({
                post,
                msg: "Comment updated successfully",
            });
        } else {
            return res.json("Not the author of comment");
        }
    } catch (e) {
        return res.json({
            e,
            msg: "Cannot update comment",
        });
    }
});
module.exports = router;
