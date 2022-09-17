const { countCurrentStreams, resetUserCount } = require("../controllers");
const {
  getUserStreamsCount,
  updateUserStreamsCount,
} = require("../config/dynamo");
const { MAX_NO_STREAMS } = require("../utils");

jest.mock("../config/dynamo");

afterEach(() => {
  jest.resetAllMocks();
});

const req = {
  newStreamUserID: "123",
};
const res = {
  status: () => ({
    json: (data) => data,
  }),
};
const next = (err) => expect(err).toBeTruthy();

describe("test /streams controller", () => {
  test("should have countController defined", () => {
    expect(countCurrentStreams).toBeDefined();
  });

  test("should have increment count by one until not anymore ", async () => {
    const user = {
      id: "123",
      name: "Castro",
      currentStreams: 0,
    };
    getUserStreamsCount.mockImplementation(() => Promise.resolve(user));
    // this updates the DB we don't care about that here
    updateUserStreamsCount.mockImplementation(() => {});

    const timesToRun = MAX_NO_STREAMS + 100;

    const promises = [...Array(timesToRun)]?.map(async (_, i) => {
      const result = await countCurrentStreams(req, res, next);

      if (i >= MAX_NO_STREAMS) {
        expect(result).toEqual({
          success: false,
          message: `Current stream is 3. Max number of streams is ${MAX_NO_STREAMS}`,
        });
      } else {
        expect(result).toEqual({
          success: true,
          message: `Current stream is ${i + 1}`,
        });
      }
    });

    await Promise.all(promises);
    expect(getUserStreamsCount).toBeCalledTimes(timesToRun);
    expect(updateUserStreamsCount).toBeCalledTimes(MAX_NO_STREAMS);
  });
});

describe("test /streams/reset controller", () => {
  test("should be defined", () => {
    expect(resetUserCount).toBeDefined();
  });

  test("should throw error is user not found", async () => {
    getUserStreamsCount.mockImplementation(() => Promise.resolve(null));
    // this updates the DB to reset streams count to zero
    updateUserStreamsCount.mockImplementation(() => {});

    try {
      await resetUserCount(req, res, next);
    } catch (e) {
      expect(e).toBe(`User with id ${req.newStreamUserID} not found`);
    }
    expect(updateUserStreamsCount).not.toBeCalled();
  });

  test("should not throw error if user is found", async () => {
    const user = {
      id: "123",
      name: "Castro",
      currentStreams: 3,
    };
    getUserStreamsCount.mockImplementation(() => Promise.resolve(user));
    // this updates the DB to reset streams count to zero
    updateUserStreamsCount.mockImplementation(() => {});

    const result = await resetUserCount(req, res, next);

    expect(result).toEqual({
      success: true,
      message: `Stream count reset to ${0}`,
    });

    expect(user.currentStreams).toBe(0);
    expect(updateUserStreamsCount).toBeCalled();
  });
});
