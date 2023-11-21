// 게시글
// localhost:3000/posts/

const express = require("express");
const postRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddleware.js");

//글작성

const { Post } = require("../../models");
postRouter.post("/", authMiddleware, async (req, res) => {
  const { title, content, photo } = req.body;
  const { loggedInUserId } = res.locals; // 미들웨어에서 추출한 loggedInUserId

  //토큰을 먼저확인하고 통과되면 아래단계진행

  // 입력 데이터 검증
  if (!title || !content || !photo) {
    return res
      .status(400)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }
  const createdPosts = await Post.create({
    title,
    content,
    photo,
    author: loggedInUserId,
  });

  res.json({ posts: createdPosts, message: "글을 등록하였습니다." });
});

//글 수정
postRouter.put("/:postId", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, content, photo } = req.body;
  const { loggedInUserId } = res.locals; // 미들웨어에서 추출한 loggedInUserId

  const post = await Post.findOne({ where: { id } });
  if (!post) {
    return res.status(404).json({ errorMessage: "글이 존재하지 않습니다." });
  }

  if (loggedInUserId !== Number(post.author)) {
    return res.status(403).json({ errorMessage: "권한이 없습니다." });
  }

  await Post.update({ title, content, photo }, { where: { id } });

  res.status(200).json({ success: true });
});

// 글 삭제
postRouter.delete("/:postId", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { loggedInUserId } = res.locals;

  const post = await Post.findOne({ where: { id } });
  if (!post) {
    return res.status(404).json({ errorMessage: "글이 존재하지 않습니다." });
  }

  if (loggedInUserId !== Number(post.author)) {
    return res.status(403).json({ errorMessage: "권한이 없습니다." });
  }

  await Post.destroy({ where: { id } });
  res
    .status(200)
    .json({ result: "success", message: "상품을 삭제하였습니다." });
});

//상품목록 조회 API
postRouter.get("/", async (req, res) => {
  const posts = await Post.findAll({ order: [["createdAt", "DESC"]] });
  res.status(200).json({ posts });
});

module.exports = postRouter;
