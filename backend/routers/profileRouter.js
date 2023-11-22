const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware.js");
const router = express.Router();

const Profiles = require("../models/profile.js");

router.get("/profile/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { email } = res.locals.user;
  const profile = await Profiles.findByPk(userId);

  try {
    if (!profile) {
      res
        .status(400)
        .send({ errorMessage: "유저가 존재하지 않습니다. 확인해주세요." });
      return false;
    }
    res.json(profile);
  } catch (error) {
    console.log(`ErrorMeassge: ${error}`);
  }
});

module.exports = router;
