require("dotenv").config();
const express = require("express");
const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postRouter");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/posts", postRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
