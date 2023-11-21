// 유저 로그인, 로그아웃
// localhost:3000/auth/
const express = require("express");
const authRouter = express.Router();

authRouter.get("/signup", (req, res) => {});
authRouter.get("/login", (req, res) => {});

module.exports = authRouter;
