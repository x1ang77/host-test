const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    likes: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        },
    ],
    comments: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            comment: {
                type: String,
            },
        },
    ],
});

module.exports = mongoose.model("post", PostSchema);
