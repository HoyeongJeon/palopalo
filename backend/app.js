require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postRouter");
const recommendationRouter = require("./routers/recommendationRouter");
const authMiddleware = require("./middlewares/authMiddleware");
const userRouter = require("./routers/userRouter");

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/recommendation", recommendationRouter);
app.use("/users", userRouter);

app.get("/", authMiddleware, (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`App listening on PORT ${process.env.PORT}`);
});
