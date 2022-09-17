const { getUserByID } = require("../config/dynamo");
const { checkUser } = require("../middlewares");
const { testUsers } = require("../utils");

jest.mock("../config/dynamo.js");

afterAll(() => {
  jest.resetAllMocks();
});

describe("middleware actions", () => {
  const req = {};
  const res = {
    status: () => ({
      json: (data) => data,
    }),
  };
  const next = (err) => expect(err).toBeTruthy();

  test("should return success false when no id is passed", async () => {
    const result = await checkUser(req, res, next);

    expect(result).toEqual({
      success: false,
      message: "User id required",
    });
  });

  test("should return success false when user id is present but user is not found", async () => {
    getUserByID.mockImplementation(() => Promise.resolve(null));

    req.headers = {
      "x-id": "123",
    };

    const result = await checkUser(req, res, next);
    expect(result).toEqual({
      success: false,
      message: "User id is invalid",
    });
    expect(getUserByID).toBeCalledTimes(1);
  });

  test("should return user with correct id passed", async () => {
    getUserByID.mockImplementation((id) =>
      Promise.resolve(testUsers.find((x) => x?.id === id) || null)
    );

    req.headers = {
      "x-id": "1234",
    };

    await checkUser(req, res, next);
    expect(req.newStreamUserID).toBe(
      testUsers.find((x) => x?.id === req.headers["x-id"])?.id
    );
    expect(getUserByID).toBeCalledTimes(1);
  });
});
