const express = require('express');
const resBody = require('../utils/resBody.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const { Userinfo } = require('../../models');
const apiRouter = express.Router();

apiRouter.get('/me', authMiddleware, async (req, res) => {
  const { loggedInUserId } = res.locals;
  if (!loggedInUserId) {
    return res.status(401).json({
      ...resBody(false, '권한이 없습니다.'),
    });
  }

  const loggedInUserInfo = await Userinfo.findOne({
    where: {
      userId: loggedInUserId,
    },
  });

  return res.status(200).json({
    success: true,
    user: {
      nickname: loggedInUserInfo.nickname,
      loggedInUserId,
    },
  });
});

module.exports = apiRouter;
