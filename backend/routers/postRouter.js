// 게시글

const express = require('express');
const { Post, Comment, Userinfo } = require('../../models');
const authMiddleware = require('../middlewares/authMiddleware.js');
const postImgUploadMiddleware = require('../middlewares/postImgUploadMiddleware.js');
const resBody = require('../utils/resBody.js');

const postRouter = express.Router();

// 글 작성
postRouter.post('/', authMiddleware, postImgUploadMiddleware.single('photo'), async (req, res) => {
  const {
    body: { title, content },
    file,
  } = req;
  const { loggedInUserId } = res.locals;
  if (!loggedInUserId) {
    return res.status(401).json({
      ...resBody(false, '권한이 없습니다.'),
    });
  }
  const user = await Userinfo.findOne({ where: { id: loggedInUserId } });
  const author = user.nickname;
  console.log(title, content);
  if (!title || !content) {
    return res.status(400).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
  }

  try {
    const createdPosts = await Post.create({
      title,
      content,
      photo: file.location,
      userId: loggedInUserId,
      author,
    });

    return res.status(200).json({
      ...resBody(true, '글을 등록하였습니다.'),
      data: createdPosts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ...resBody(false, '게시글 등록에 실패했습니다.'),
    });
  }
});

//글 수정
postRouter.put('/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const { loggedInUserId } = res.locals;

  const post = await Post.findOne({ where: { id: postId } });
  if (!post) {
    return res.status(404).json({
      ...resBody(false, '글이 존재하지 않습니다.'),
    });
  }

  if (loggedInUserId !== Number(post.userId)) {
    return res.status(403).json({
      ...resBody(false, '권한이 없습니다.'),
    });
  }

  await Post.update({ title, content }, { where: { id: postId } });

  return res.status(200).json({ ...resBody(true, '게시글이 수정되었습니다.') });
});

// 글 삭제
postRouter.delete('/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { loggedInUserId } = res.locals;

  const post = await Post.findOne({ where: { id: postId } });
  if (!post) {
    return res.status(404).json({
      ...resBody(false, '글이 존재하지 않습니다.'),
    });
  }

  if (loggedInUserId !== Number(post.userId)) {
    return res.status(403).json({
      ...resBody(false, '권한이 없습니다.'),
    });
  }

  await Post.destroy({ where: { id: postId } });
  return res.status(200).json({
    ...resBody(true, '게시글이 삭제되었습니다.'),
  });
});

//전체 글 조회 API
postRouter.get('/', async (req, res) => {
  const posts = await Post.findAll({
    order: [['createdAt', 'DESC']],
  });

  return res.status(200).json({ success: true, data: posts });
});

// 글 상세 조회 API
postRouter.get('/:postId', async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findOne({
    where: { id: postId },
    attributes: ['title', 'content', 'photo'],
  });
  const comments = await Comment.findAll({ where: { postId } });
  if (!post) {
    return res.status(400).json({
      ...resBody(true, '작성된 글이 없습니다.'),
    });
  }

  return res.status(200).json({ success: true, data: { post, comments } });
});

//댓글 작성
postRouter.post('/:postId/comment', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { loggedInUserId } = res.locals;

  const { text } = req.body;

  const post = await Post.findByPk(postId);
  const user = await Userinfo.findOne({
    where: { id: loggedInUserId },
  });

  try {
    if (!post) {
      return res.status(400).json({ ...resBody(false, '게시글이 존재하지 않습니다.') });
    }

    const comment = await Comment.create({
      postId: postId,
      nickname: user.nickname,
      content: text,
      userId: loggedInUserId,
    });

    return res.status(200).json({ ...resBody(true, '댓글이 생성되었습니다.'), comment });
  } catch (error) {
    console.log(`errorMessage: ${error}`);
    return res.status(500).json({ ...resBody(false, '댓글 생성에 실패했습니다.') });
  }
});

// 댓글 조회

postRouter.get('/:postId/comments', async (req, res) => {
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
        ...resBody(false, '게시글이 존재하지 않습니다.'),
      });
    }
    return res.status(200).json({ ...resBody(true, '댓글 조회에 성공했습니다.'), comments });
  } catch (error) {
    console.error('ErrorMessag:', error);
    return res.status(500).json({ ...resBody(false, '댓글 조회에 실패했습니다.') });
  }
});

// 댓글 수정
postRouter.put('/:postId/:commentId', authMiddleware, async (req, res) => {
  const { postId, commentId } = req.params;
  const { loggedInUserId } = res.locals;
  const { content } = req.body;

  const users = await Userinfo.findOne({
    where: { userid: loggedInUserId },
  });
  const comments = await Comment.findOne({
    where: { postId: postId, id: commentId },
  });
  try {
    if (comments.nickname !== users.nickname) {
      return res.status(400).json({
        ...resBody(false, '권한이 없습니다.'),
      });
    }
    await comments.update({
      content: content,
    });
    return res.status(200).json({ ...resBody(true, '댓글이 수정되었습니다.') });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ...resBody(false, '댓글이 수정에 실패했습니다.') });
  }
});

// 댓글 삭제
postRouter.delete('/:postId/:commentId', authMiddleware, async (req, res) => {
  const { postId, commentId } = req.params;
  const { loggedInUserId } = res.locals;

  const users = await Userinfo.findOne({
    where: { userid: loggedInUserId },
  });

  const comments = await Comment.findOne({
    where: { postId: postId, id: commentId },
  });

  try {
    if (comments.nickname !== users.nickname) {
      console.log(users.nickname, commentId.nickname, postId);
      return res.status(400).json({
        ...resBody(false, '작성한 사용자만 삭제 가능합니다.'),
      });
    }
    await comments.destroy({
      where: { postId: postId, id: commentId, nickname: users.nickname },
    });
    return res.status(200).json({
      ...resBody(true, '댓글이 삭제 되었습니다.'),
    });
  } catch (error) {
    console.log('error:', error);
    return res.status(500).json({ ...resBody(false, '댓글 삭제에 실패했습니다.') });
  }
});

module.exports = postRouter;
