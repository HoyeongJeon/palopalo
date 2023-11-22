// 회원가입 유효성 검사를 위한 미들웨어

const { check, validationResult } = require("express-validator");

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    return res.status(403).json({ success: false, errors: errors.array() });
  }
};

const validationCheck = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage("이메일을 입력해주세요")
    .isEmail()
    .withMessage("이메일이 아닙니다."),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("비밀번호를 입력해주세요")
    .isLength({ min: 6 })
    .withMessage("6자 이상으로 적어주세요!"),
  check("name").trim().notEmpty().withMessage("이름이 뭐에요!?"),
  check("nickname").trim().notEmpty().withMessage("닉네임을 만들어주세요!"),
  check("introduce")
    .trim()
    .notEmpty()
    .withMessage("본인을 표현하는 한 줄의 자기소개를 적어주세요~")
    .isLength({ min: 6, max: 30 })
    .withMessage("6자 이상 , 30자 미만으로 적어주세요!"),

  check("location").trim().notEmpty().withMessage("지역을 말해주세요!"),
  validationMiddleware,
];

module.exports = validationCheck;
