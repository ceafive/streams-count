const { getUserByID } = require("../config/dynamo");

exports.checkUser = async (req, res, next) => {
  let id = req.headers?.["x-id"];
  id = id ? String(id) : "";

  if (!id) {
    return res.status(404).json({
      success: false,
      message: "User id required",
    });
  }

  const user = await getUserByID(id);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User id is invalid",
    });
  }

  req.newStreamUserID = user?.id;
  next();
};
