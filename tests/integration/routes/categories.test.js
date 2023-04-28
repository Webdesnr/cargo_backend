const mongoose = require("mongoose");
const request = require("supertest");
const { Category } = require("../../../models/category");
const { User } = require("../../../models/user");
let server;

describe("/api/categories", () => {
  beforeEach(() => {
    server = require("../../../index");
  });
  afterEach(async () => {
    server.close();
    await Category.collection.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all categories", async () => {
      await Category.collection.insertMany([
        { name: "category1" },
        { name: "category2" },
      ]);
      const res = await request(server).get("/api/categories");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe("GET /:id", () => {
    it("should return category if valid id is passed", async () => {
      const category = new Category({ name: "category1" });
      await category.save();

      const res = await request(server).get("/api/categories/" + category._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", category.name);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/categories/" + 1);

      expect(res.status).toBe(404);
    });

    it("should return 404 if no category with the given id exists", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).get("/api/categories/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let name;

    const exec = () => {
      return request(server)
        .post("/api/categories")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(async () => {
      token = await new User().generateToken();
      name = "category1";
    });

    it("should return 401 if client is not logged in ", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if category is less than 3 charactor", async () => {
      name = "12";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if category is greater than 10", async () => {
      name = new Array(12).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should create category if it is valid", async () => {
      await exec();

      const category = await Category.find({ name: "category1" });

      expect(category).not.toBeNull();
    });

    it("should create category if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "CATEGORY1");
    });
  });

  describe("PUT /:id", () => {
    let id;
    let token;
    let newName;
    let category;
    const exec = async () => {
      return await request(server)
        .put("/api/categories/" + id)
        .set("x-auth-token", token)
        .send({ name: newName });
    };

    beforeEach(async () => {
      category = new Category({ name: "category1" });
      await category.save();

      token = new User().generateToken();
      id = category._id.toString();
      newName = "UPDATED";
    });

    it("should return 401 if user not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 404 if invalid id is passed", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 400 if input is lesser than 3", async () => {
      newName = "12";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if input is greater than 3", async () => {
      newName = new Array(12).join("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if category not exist with given id", async () => {
      id = new mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should update the category with the valid id", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", newName);
    });
  });

  describe("DELETE /:id", () => {
    let token;
    let id;
    let category;

    const exec = () => {
      return request(server)
        .delete("/api/categories/" + id)
        .set("x-auth-token", token);
    };

    beforeEach(async () => {
      category = new Category({ name: "category" });
      await category.save();

      token = new User({
        email: "a@a.com",
        password: "123456",
        username: "aaa",
        isAdmin: true,
      }).generateToken();

      id = category._id.toString();
    });

    it("should return 404 if invalid is passed", async () => {
      id = 1;

      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 401 user not logged in", async () => {
      token = "";

      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 403 if user is not admin", async () => {
      token = new User().generateToken();

      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return 200 if category is deleted", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });
  });
});
