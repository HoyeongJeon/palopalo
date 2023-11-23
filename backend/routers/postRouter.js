// 게시글
// localhost:3000/posts/

const express = require("express");
const postRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddleware.js");

//글작성
const { Userinfo } = require("../../models");
const { User } = require("../../models");
const { Post } = require("../../models");
const { Comment } = require("../../models");

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

  // User에서 nickname 값을 가져옵니다.
  const user = await User.findOne({ where: { id: loggedInUserId } });
  const author = user.nickname;

  const createdPosts = await Post.create({
    title,
    content,
    photo,
    userId: loggedInUserId,
    author,
  });

  res.json({ posts: createdPosts, message: "글을 등록하였습니다." });
});

//글 수정
postRouter.put("/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { title, content, photo } = req.body;
  const { loggedInUserId } = res.locals; // 미들웨어에서 추출한 loggedInUserId

  const post = await Post.findOne({ where: { id: postId } });
  if (!post) {
    return res.status(404).json({ errorMessage: "글이 존재하지 않습니다." });
  }

  if (loggedInUserId !== Number(post.userId)) {
    return res.status(403).json({ errorMessage: "권한이 없습니다." });
  }

  await Post.update({ title, content, photo }, { where: { id: postId } });

  res.status(200).json({ success: true });
});

// 글 삭제
postRouter.delete("/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { loggedInUserId } = res.locals;

  const post = await Post.findOne({ where: { id: postId } });
  if (!post) {
    return res.status(404).json({ errorMessage: "글이 존재하지 않습니다." });
  }

  if (loggedInUserId !== Number(post.userId)) {
    return res.status(403).json({ errorMessage: "권한이 없습니다." });
  }

  await Post.destroy({ where: { id: postId } });
  res
    .status(200)
    .json({ result: "success", message: "상품을 삭제하였습니다." });
});

//전체 글 조회 API
postRouter.get("/", async (req, res) => {
  const posts = await Post.findAll({
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({ posts });
});

// 글 상세 조회 API
postRouter.get("/:postId", async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findOne({
    where: { id: postId },
    attributes: ["title", "content", "photo"],
  });

  if (!post) {
    return res.status(400).json({ errorMessage: "작성된 글이 없습니다." });
  }

  res.status(200).json({ post });
});

//댓글 작성
postRouter.post("/:postId/comment", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { loggedInUserId } = res.locals;

  const { text } = req.body;

  const post = await Post.findByPk(postId);
  const user = await User.findOne({
    where: { id: loggedInUserId },
  });

  try {
    if (!post) {
      res.status(400).send({ errorMessage: "게시글이 존재하지 않습니다." });
      return false;
    }
    console.log(user.nickname);
    const comment = await Comment.create({
      postId: postId,
      nickname: user.nickname,
      content: text,
    });
    res.status(200).json({ message: Comment });
  } catch (error) {
    console.log(`errorMessage: ${error}`);
  }
});

// 댓글 조회

postRouter.get("/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({
    where: { id: postId },
  });
  const comments = await Comment.findAll({
    where: { PostId: postId },
  });

  try {
    if (!post) {
      return res
        .status(404)
        .send({ errorMessage: "게시글이 존재하지 않습니다." });
      return false;
    }
    res.status(200).json(comments);
  } catch (error) {
    console.log("ErrorMessag:", error);
  }
});

postRouter.put("/:postId/:commentId", authMiddleware, async (req, res) => {
  const { postId, commentId } = req.params;
  const { loggedInUserId } = res.locals;

  const { contentCh } = req.body;

  console.log(loggedInUserId);

  const users = await Userinfo.findOne({
    where: { userid: loggedInUserId },
  });
  const comments = await Comment.findOne({
    where: { postId: postId, id: commentId },
  });
  console.log(users.nickname);
  console.log(comments.content);
  try {
    if (comments.nickname !== users.nickname) {
      res.status(400).json({ Message: "false" });
      return false;
    }
    await comments.update({
      content: contentCh,
    });
  } catch (error) {
    console.log(error);
  }
});

postRouter.delete("/:postId/:commentId", authMiddleware, async (req, res) => {
  const { postId, commentId } = req.params;
  const { loggedInUserId } = res.locals;

  const users = await Userinfo.findOne({
    where: { userid: loggedInUserId },
  });

  const comments = await Comment.findOne({
    where: { postId: postId, id: commentId },
  });

  try {
    if (commentId.nickname !== users.nickname) {
      res.status(400).json({ Message: "작성한 사용자만 삭제 가능합니다." });
      return false;
    }
    await comments.destroy({
      where: { postId: postId, id: commentId, nickname: users.nickname },
    });
  } catch (error) {
    console.log("error:", error);
  }
});

module.exports = postRouter;
