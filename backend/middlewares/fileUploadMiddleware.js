const multer = require("multer");
const upload = multer({ dest: "uploads/profile" });

module.exports = upload;
