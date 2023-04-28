const request = require("supertest");
const { Category } = require("../../../models/category");
const { User } = require("../../../models/user");
let server;

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../../index");
  });
  afterEach(async () => {
    server.close();
    await Category.collection.deleteMany({});
  });

  let token;

  const exec = () => {
    return request(server)
      .post("/api/categories")
      .set("x-auth-token", token)
      .send({ name: "category1" });
  };

  beforeEach(() => {
    token = new User().generateToken();
  });

  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });
  it("should return 400 if token is invalid", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 200 if token is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
