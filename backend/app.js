require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postRouter");
const recommendationRouter = require("./routers/recommendationRouter");
const authMiddleware = require("./middlewares/authMiddleware");
const userRouter = require("./routers/userRouter");
const apiRouter = require("./routers/apiRouter");
const path = require("path");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/recommendation", recommendationRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

// app.get("/", authMiddleware, (req, res) => {
//   res.send("Hello World!");
// });

app.use("/", express.static(path.join(__dirname, "assets")));
app.use(express.static("assets"));

app.listen(process.env.PORT, () => {
  console.log(`App listening on PORT ${process.env.PORT}`);
});
