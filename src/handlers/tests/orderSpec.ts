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

describe("Order Handler", () => {
  it("should create a new user, new order, new product, add a product and see that order by the user", async () => {
    const user = await createTestUser();
    expect(user.status).toBe(200);

    const product = await req
      .post("/products")
      .send({
        name: "Test product",
        price: 200,
      })
      .set("Authorization", "Bearer " + user.body.token);
    expect(product.status).toBe(200);

    const order = await req.post("/orders").send({
      userId: user.body.id,
      status: "active",
    });
    expect(order.status).toBe(200);

    const addProduct = await req
      .post("/orders/" + order.body.id + "/products")
      .send({
        quantity: 10,
        productId: product.body.id,
      });
    expect(addProduct.status).toBe(200);

    const currentOrderByUser = await req
      .get("/users/" + user.body.id + "/order")
      .set("Authorization", "Bearer " + user.body.token);
    expect(currentOrderByUser.status).toBe(200);
  });
});
