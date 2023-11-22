const express = require("express");
const { Op } = require("sequelize");
const { User, sequelize } = require("../../models");
const authMiddleware = require("../middlewares/authMiddleware");

const recommendationRouter = express.Router();

const showFriendInfo = (friend) => ({
  nickname: friend.nickname,
  introduce: friend.introduce,
});

recommendationRouter.get("/", authMiddleware, async (req, res) => {
  const { loggedInUserId } = res.locals;
  if (!loggedInUserId) {
    return res.status(401).json({
      success: false,
      message: "권한이 없습니다.",
    });
  }

  // 로그인 한 유저의 지역 찾기
  const { location } = await User.findByPk(loggedInUserId);

  // 로그인 한 유저랑 같은 지역의 사람 찾기
  const potentialFriends = await User.findAll({
    where: {
      location,
      id: { [Op.ne]: loggedInUserId },
    },
    order: sequelize.random(), // 랜덤 친구 추천
    limit: 3,
  });

  // 같은 지역 사람들 리턴해주기(자기소개랑 같이)
  return res.status(200).send({
    success: true,
    recommendation: potentialFriends.map(showFriendInfo),
  });
});

module.exports = recommendationRouter;
