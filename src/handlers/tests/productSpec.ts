import supertest from "supertest";
import app from "../../server";

const req = supertest(app);

describe("Product Handler", () => {
  it("should return a 200 status in index endpoint", async () => {
    const res = await req.get("/products");
    expect(res.status).toBe(200);
  });

  it("should return a 200 status in show endpoint", async () => {
    const res = await req.get("/products/1");
    expect(res.status).toBe(200);
  });

  it("should create a new product", async () => {
    const token = await req.post("/users").send({
      firstName: "API",
      lastName: "User",
      password: "pass123",
    });
    expect(token.status).toBe(200);

    const res = await req
      .post("/products")
      .send({
        name: "API Test Product",
        price: 10,
      })
      .set("Authorization", "Bearer " + token.body);
    expect(res.status).toEqual(200);
  });
});
