const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//REGISTER localhost:3000/
router.post("/register", async (req, res) => {
    try {
        const { name, username, password } = req.body;
        if (username.length < 8)
            return res.status(400).json({
                msg: "Username should be at least 8 characters",
                code: 400,
            });
        if (password.length < 8)
            return res.status(400).json({
                msg: "Password should be at least 8 characters",
                code: 400,
            });

        let userFound = await User.findOne({
            username,
        });
        if (userFound)
            return res.status(400).json({
                msg: "User already exists",
                code: 400,
            });

        const user = new User();
        user.name = name;
        user.username = username;

        //Hash the password
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);
        user.password = hash;
        user.save();
        return res.json({
            msg: "Registered succesfully",
            user,
        });
    } catch (e) {
        return res.json({
            e,
            msg: "Failed to register",
            code: 400,
        });
    }
});

//LOGIN

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        let userFound = await User.findOne({
            username,
        });
        if (!userFound)
            return res.json({
                msg: "User doesn't exist",
                code: 400,
            });

        let isMatch = bcrypt.compareSync(password, userFound.password);
        if (!isMatch)
            return res.json({
                msg: "Invalid Credentials",
                code: 400,
            });

        jwt.sign(
            {
                data: userFound,
            },
            "haaland",
            {
                expiresIn: "1h",
            },
            (err, token) => {
                if (err)
                    return res.status(400).json({
                        err,
                        msg: "Cannot generate token",
                        code: 400,
                    });
                return res.json({ msg: "Logged in succesfully", token });
            }
        );
    } catch (e) {
        return res.json({
            e,
            message: "Invalid Credentials",
            code: 400,
        });
    }
});

module.exports = router;
