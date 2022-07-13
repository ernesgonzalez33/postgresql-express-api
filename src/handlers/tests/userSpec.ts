import supertest from "supertest";
import app from "../../server";

const req = supertest(app);

const createTestUser = async () => {
  const res = await req.post("/users").send({
    firstName: "Test",
    lastName: "User",
    password: "pass123",
  });
  return res;
};

describe("User Handler", () => {
  it("should have created a new user", async () => {
    const res = await createTestUser();
    expect(res.status).toBe(200);
  });

  it("should return a 200 status in the index endpoint", async () => {
    const user = await createTestUser();
    const res = await req
      .get("/users")
      .set("Authorization", "Bearer " + user.body.token);
    expect(res.status).toBe(200);
  });

  it("should return a 200 status in the show endpoint", async () => {
    const user = await createTestUser();
    const res = await req
      .get("/users/1")
      .set("Authorization", "Bearer " + user.body.token);
    expect(res.status).toBe(200);
  });
});
