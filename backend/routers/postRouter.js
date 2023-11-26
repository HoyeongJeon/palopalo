// 게시글
// localhost:3000/posts/

const express = require("express");
const postRouter = express.Router();
const { Post, Comment, Userinfo } = require("../../models");
const authMiddleware = require("../middlewares/authMiddleware.js");
const resBody = require("../utils/resBody.js");

// 글 작성
postRouter.post("/", authMiddleware, async (req, res) => {
  const { title, content, photo } = req.body;
  const { loggedInUserId } = res.locals; // 미들웨어에서 추출한 loggedInUserId

  // 입력 데이터 검증
  if (!title || !content || !photo) {
    return res
      .status(400)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }

  // User에서 nickname 값을 가져옵니다.
  const user = await Userinfo.findOne({ where: { id: loggedInUserId } });
  const author = user.nickname;

  const createdPosts = await Post.create({
    title,
    content,
    photo,
    userId: loggedInUserId,
    author,
  });

  res.json({
    ...resBody(false, "글을 등록하였습니다."),
    data: createdPosts,
  });
});

//글 수정
postRouter.put("/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { title, content, photo } = req.body;
  const { loggedInUserId } = res.locals; // 미들웨어에서 추출한 loggedInUserId

  const post = await Post.findOne({ where: { id: postId } });
  if (!post) {
    return res.status(404).json({
      ...resBody(false, "글이 존재하지 않습니다."),
    });
  }

  if (loggedInUserId !== Number(post.userId)) {
    return res.status(403).json({
      ...resBody(false, "권한이 없습니다."),
    });
  }

  await Post.update({ title, content, photo }, { where: { id: postId } });

  return res.status(200).json({ ...resBody(true, "게시글이 수정되었습니다.") });
});

// 글 삭제
postRouter.delete("/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { loggedInUserId } = res.locals;

  const post = await Post.findOne({ where: { id: postId } });
  if (!post) {
    return res.status(404).json({
      ...resBody(false, "글이 존재하지 않습니다."),
    });
  }

  if (loggedInUserId !== Number(post.userId)) {
    return res.status(403).json({
      ...resBody(false, "권한이 없습니다."),
    });
  }

  await Post.destroy({ where: { id: postId } });
  return res.status(200).json({
    ...resBody(true, "게시글이 삭제되었습니다."),
  });
});

//전체 글 조회 API
postRouter.get("/", async (req, res) => {
  const posts = await Post.findAll({
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({ success: true, data: posts });
});

// 글 상세 조회 API
postRouter.get("/:postId", async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findOne({
    where: { id: postId },
    attributes: ["title", "content", "photo"],
  });
  const comments = await Comment.findAll({ where: { postId } });
  if (!post) {
    return res.status(400).json({
      ...resBody(true, "작성된 글이 없습니다."),
    });
  }

  return res.status(200).json({ success: true, data: { post, comments } });
});

//댓글 작성
postRouter.post("/:postId/comment", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { loggedInUserId } = res.locals;

  const { text } = req.body;

  const post = await Post.findByPk(postId);
  const user = await Userinfo.findOne({
    where: { id: loggedInUserId },
  });

  try {
    if (!post) {
      return res
        .status(400)
        .json({ ...resBody(false, "게시글이 존재하지 않습니다.") });
    }

    const comment = await Comment.create({
      postId: postId,
      nickname: user.nickname,
      content: text,
      userId: loggedInUserId,
    });

    return res
      .status(200)
      .json({ ...resBody(true, "댓글이 생성되었습니다."), comment });
  } catch (error) {
    console.log(`errorMessage: ${error}`);
    return res
      .status(500)
      .json({ ...resBody(false, "댓글 생성에 실패했습니다.") });
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
      return res.status(404).json({
        ...resBody(false, "게시글이 존재하지 않습니다."),
      });
    }
    return res
      .status(200)
      .json({ ...resBody(true, "댓글 조회에 성공했습니다."), comments });
  } catch (error) {
    console.error("ErrorMessag:", error);
    return res
      .status(500)
      .json({ ...resBody(false, "댓글 조회에 실패했습니다.") });
  }
});

// 댓글 수정
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
  try {
    if (comments.nickname !== users.nickname) {
      return res.status(400).json({
        ...resBody(false, "권한이 없습니다."),
      });
    }
    await comments.update({
      content: contentCh,
    });
    return res
      .status(200)
      .json({ ...resBody(false, "댓글이 수정되었습니다.") });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ...resBody(false, "댓글이 수정에 실패했습니다.") });
  }
});

// 댓글 삭제
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
      return res.status(400).json({
        ...resBody(false, "작성한 사용자만 삭제 가능합니다."),
      });
    }
    await comments.destroy({
      where: { postId: postId, id: commentId, nickname: users.nickname },
    });
  } catch (error) {
    console.log("error:", error);
    return res
      .status(500)
      .json({ ...resBody(false, "댓글 삭제에 실패했습니다.") });
  }
});

module.exports = postRouter;
