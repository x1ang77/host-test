const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 5000;
const cors = require("cors");

// mongoose.connect("mongodb://127.0.0.1:27017/B5B6");
mongoose.connect(
    "mongodb+srv://XiangZe:Mcfc1234@cluster0.lnaghki.mongodb.net/Blog?retryWrites=true&w=majority"
);
app.use(express.json());
app.use(cors());

app.use("/users", require("./routes/users"));
app.use("/posts", require("./routes/posts"));
app.use("/likes", require("./routes/likes"));
app.use("/comments", require("./routes/comments"));

app.listen(PORT, () => console.log("Server is running in PORT " + PORT));
mongoose.connection.once("open", () => console.log("Connected to MongoDB"));
