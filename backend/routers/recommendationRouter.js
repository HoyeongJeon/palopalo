const express = require("express");
const { Op } = require("sequelize");
const { sequelize, Userinfo } = require("../../models");
const authMiddleware = require("../middlewares/authMiddleware");

const recommendationRouter = express.Router();

const showFriendInfo = (friend) => ({
  profile_picture: friend.profile_picture,
  nickname: friend.nickname,
  introduce: friend.introduce,
  location: friend.location,
  favorite_weather: friend.favorite_weather,
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
  const { location } = await Userinfo.findOne({
    where: {
      userId: loggedInUserId,
    },
  });

  // 로그인 한 유저랑 같은 지역의 사람 찾기
  const potentialFriends = await Userinfo.findAll({
    where: {
      location,
      userId: { [Op.ne]: loggedInUserId },
    },
    order: sequelize.random(), // 랜덤 친구 추천
    limit: 3,
  });

  if (!potentialFriends.length) {
    return res.status(200).send({
      success: true,
      message: "같은 지역에 머무르는 친구가 없어요 😭",
    });
  }
  // 같은 지역 사람들 리턴해주기(자기소개랑 같이)
  return res.status(200).send({
    success: true,
    recommendation: potentialFriends.map(showFriendInfo),
  });
});

module.exports = recommendationRouter;
