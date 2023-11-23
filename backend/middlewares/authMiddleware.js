const jwt = require("jsonwebtoken");
const {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} = require("jsonwebtoken");
const resBody = require("../utils/resBody.js");

const authMiddleware = (req, res, next) => {
  const { Authorization } = req.cookies;
  console.log(Authorization);
  if (!Authorization) {
    return res.status(401).json({ ...resBody(false, "로그인 해주세요") });
  }
  // 토큰 표준과 일치하지 않는 경우
  const [tokenType, tokenCredential] = Authorization.split(" ");
  if (!tokenType || !tokenCredential || tokenType !== "Bearer") {
    // 토큰 중 하나라도 없는 경우
    return res.status(401).json({ ...resBody(false, "로그인 해주세요") });
  }

  // 토큰 에러 종류별로 핸들링 (만료, 삭제)

  try {
    const { loggedInUserId } = jwt.verify(
      tokenCredential,
      process.env.SECRET_KEY
    );
    // 인증에 성공하는 경우에는 req.locals.user에 인증 된 사용자 정보를 담고, 다음 동작을 진행
    res.locals.loggedInUserId = loggedInUserId;
    next();
  } catch (error) {
    // JWT의 유효기한이 지난 경우
    if (error instanceof TokenExpiredError) {
      console.error(error);
      return res.status(401).json({
        ...resBody(false, "토큰이 만료되었어요! 다시 로그인해주세요"),
      });
    } else if (error instanceof JsonWebTokenError) {
      //JWT 검증(JWT Secret 불일치, 데이터 조작으로 인한 Signature 불일치 등)에 실패한 경우
      console.error(error);
      return res.status(401).json({
        ...resBody(
          false,
          "유효하지 않은 시그니처입니다. JWT Secret Key 확인이 필요합니다."
        ),
      });
    } else if (error instanceof NotBeforeError) {
      console.error(error);
      return res.status(401).json({
        ...resBody(false, "다시 로그인해주세요"),
      });
    } else {
      console.error(error);
      return res.status(500).json({
        ...resBody(false, "다시 로그인해주세요"),
      });
    }
  }
};

module.exports = authMiddleware;
