
const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const Issue = require("../models/Issue");

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/janconnect_test', {
    useNewUrlParser: true, useUnifiedTopology: true,
  });
});
afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await Issue.deleteMany({});
});

test("Create & fetch an issue", async () => {
  const payload = {
    type: "Garbage Overflow",
    description: "Test description",
    department: "MCD",
    status: "Pending"
  };
  const res = await request(app).post("/api/issues").send(payload);
  expect(res.statusCode).toBe(201);
  expect(res.body.type).toBe("Garbage Overflow");

  const getRes = await request(app).get("/api/issues");
  expect(getRes.body.length).toBe(1);
  expect(getRes.body[0].department).toBe("MCD");
});
