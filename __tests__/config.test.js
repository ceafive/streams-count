require("dotenv").config();

describe("test config utils", () => {
  test("should set env vars correctly", () => {
    process.env.PORT = "5000";
    const { port } = require("../config/utils");

    expect(port).toBe("5000");
  });
});
