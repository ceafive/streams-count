require("dotenv").config();

const supertest = require("supertest");
const app = require("../app");
const { logger } = require("../logger");

describe("test server is working", () => {
  test("should return 404 for wrong route", async function () {
    const res = await supertest(app).get("/test");
    expect(res.statusCode).toBe(404);
  });

  test("should return 404 for wrong method", async function () {
    const res = await supertest(app).post("/");
    expect(res.statusCode).toBe(404);
  });

  test("should return it is working", async () => {
    const res = await supertest(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/it's working/i);
  });
});

describe("/streams route", () => {
  test("should return 404 no user id", async () => {
    const { statusCode, body } = await supertest(app).get("/streams");
    expect(statusCode).toBe(404);
    expect(body).toEqual({ message: "User id required", success: false });
  });
});

describe("logger", () => {
  test("should test branching for both envs", async () => {
    expect(logger).toBeDefined();
    process.env.NODE_ENV = "production";
    expect(logger).toBeDefined();
  });
});
