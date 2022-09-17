const { getUserByID } = require("../config/dynamo");

// mock user token or special header in the request to identify user
exports.checkUser = async (req, res, next) => {
  try {
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
    return next();
  } catch (error) {
    return next(error);
  }
};
