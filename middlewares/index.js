const { findUserByID } = require("../db");

exports.checkUser = async (req, res, next) => {
  let token = req.headers?.["x-id"];
  token = token ? String(token) : "";

  if (!token) {
    return res.status(404).json({
      success: false,
      message: "User id required",
    });
  }

  const user = await findUserByID(token);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User token is invalid",
    });
  }

  req.newStreamUserID = user?.id;
  next();
};
