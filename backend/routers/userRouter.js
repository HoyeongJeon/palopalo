const express = require("express");
const { User, Userinfo } = require("../../models");
const resBody = require("../utils/resBody.js");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middlewares/authMiddleware.js");
const fileUpoadMiddleware = require("../middlewares/fileUploadMiddleware.js");

const userRouter = express.Router();

// 내 프로필 보기
userRouter.get("/me", authMiddleware, async (req, res) => {
  const { loggedInUserId } = res.locals;
  if (!loggedInUserId) {
    return res.status(401).json({
      ...resBody(false, "권한이 없습니다."),
    });
  }

  const loggedInUserPrivateInfo = await User.findByPk(loggedInUserId);
  const loggedInUserInfo = await Userinfo.findOne({
    where: {
      userId: loggedInUserId,
    },
  });

  return res.status(200).json({
    success: true,
    user: {
      email: loggedInUserPrivateInfo.email,
      name: loggedInUserPrivateInfo.name,
      profile_picture: loggedInUserInfo.profile_picture,
      nickname: loggedInUserInfo.nickname,
      favorite_weather: loggedInUserInfo.favorite_weather,
      location: loggedInUserInfo.location,
      introduce: loggedInUserInfo.introduce,
    },
  });
});

// 원래 patch
// 실험을 위해 post로 변경
userRouter.post(
  "/me/edit",
  authMiddleware,
  fileUpoadMiddleware.single("profile_picture"),
  async (req, res) => {
    // 수정 가능한 정보들 nickname, location, introduce, favorite_weather, password, profile_picture
    const {
      body: {
        nickname,
        location,
        introduce,
        favorite_weather,
        profile_picture,
      },
      file,
    } = req;
    const { loggedInUserId } = res.locals;
    if (!loggedInUserId) {
      return res.status(401).json({
        ...resBody(false, "권한이 없습니다."),
      });
    }
    // 비밀번호를 입력하지 않은 경우
    // if (!password) {
    //   return res
    //     .status(400)
    //     .json({ ...resBody(false, "비밀번호를 입력해주세요.") });
    // }

    const me = await User.findByPk(loggedInUserId);

    // 유저가 없는 경우
    if (!me) {
      return res.status(404).json({
        ...resBody(false, "유저가 존재하지 않습니다."),
      });
    }
    // 비밀번호가 틀린 경우
    // const isMatch = await bcrypt.compare(password, me.password);
    // if (!isMatch) {
    //   return res
    //     .status(400)
    //     .json({ ...resBody(false, "잘못된 비밀번호입니다.") });
    // }

    const meInfo = await Userinfo.findOne({
      where: {
        userId: loggedInUserId,
      },
    });
    //비밀번호 수정
    let user = {};
    user.nickname = nickname ? nickname : meInfo.nickname;
    user.location = location ? location : meInfo.location;
    user.profile_picture = profile_picture
      ? profile_picture
      : me.profile_picture;
    user.introduce = introduce ? introduce : meInfo.introduce;
    user.favorite_weather = favorite_weather
      ? favorite_weather
      : meInfo.favorite_weather;
    user.profile_picture = file ? file.path : meInfo.profile_picture;

    try {
      await Userinfo.update(
        {
          ...user,
        },
        {
          where: {
            userId: loggedInUserId,
          },
        }
      );
      return res
        .status(200)
        .json({ ...resBody(true, "정보가 수정되었습니다.") });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ ...resBody(false, "내 정보 수정에 실패했습니다.") });
    }
  }
);

// 내 비밀번호 수정
// 프론트엔드 폼을 위해 post로 변경
userRouter.post("/me/password-edit", authMiddleware, async (req, res) => {
  const { password, newPassword, newPasswordCheck } = req.body;
  const { loggedInUserId } = res.locals;
  // 비밀번호를 입력하지 않은 경우
  if (!password) {
    return res
      .status(400)
      .json({ ...resBody(false, "비밀번호를 입력해주세요.") });
  }

  const me = await User.findByPk(loggedInUserId);

  // 유저가 없는 경우
  if (!me) {
    return res.status(404).json({
      ...resBody(false, "유저가 존재하지 않습니다."),
    });
  }
  // 비밀번호가 틀린 경우
  const isMatch = await bcrypt.compare(password, me.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ ...resBody(false, "비밀번호가 일치하지 않습니다.") });
  }

  if (newPassword.length < 6 && newPasswordCheck.length < 6) {
    return res
      .status(400)
      .json({ ...resBody(false, "비밀번호는 최소 6자리 이상이어야 합니다.") });
  }

  if (newPassword !== newPasswordCheck) {
    return res
      .status(400)
      .json({ ...resBody(false, "비밀번호 확인이 일치하지 않습니다.") });
  }
  // 새로운 비밀번호 암호화
  const hashedNewPassword = await bcrypt.hash(
    newPassword,
    Number(process.env.SALT)
  );

  // 새로운 비밀번호 저장
  try {
    await User.update(
      {
        name: me.name,
        email: me.email,
        password: hashedNewPassword,
      },
      {
        where: {
          id: loggedInUserId,
        },
      }
    );

    res.clearCookie("Authorization");
    return res
      .status(200)
      .json({ ...resBody(true, "비밀번호가 수정되었습니다.") });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ...resBody(false, "비밀번호 수정에 실패했습니다.") });
  }
});

// 남의 프로필 보기
userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  const loggedInUserInfo = await Userinfo.findOne({
    where: {
      userId: id,
    },
  });

  if (!loggedInUserInfo) {
    return res.status(404).json({
      ...resBody(false, "유저가 존재하지 않습니다."),
    });
  }

  return res.status(200).json({
    success: true,
    user: {
      nickname: loggedInUserInfo.nickname,
      favorite_weather: loggedInUserInfo.favorite_weather,
      location: loggedInUserInfo.location,
      introduce: loggedInUserInfo.introduce,
    },
  });
});

module.exports = userRouter;
