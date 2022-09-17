const { addUsersToDB } = require("../config/dynamo");
const seed = require("../seed");

jest.mock("../config/dynamo");

describe("seeding initial items to db", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  test("should throw if param is not an array", async () => {
    const testData = {
      id: "444",
      name: "Eyram",
      createdAt: new Date().getTime(),
    };

    try {
      await seed(testData);
    } catch (e) {
      expect(e).toMatch(/Param must be an array/gi);
    }
  });

  test("should send items to db and return each inddividual item", async () => {
    const testData = [
      {
        id: "444",
        name: "Eyram",
        createdAt: new Date().getTime(),
      },
      {
        id: "4445",
        name: "Eyram Agbo",
        createdAt: new Date().getTime(),
      },
    ];

    addUsersToDB.mockImplementation((x) => Promise.resolve(x));
    const result = await seed(testData);

    expect(result).toEqual(testData);
    expect(addUsersToDB).toBeCalledTimes(testData.length);
  });
});
