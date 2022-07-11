import { User, UserStore } from "../user";

const store = new UserStore();

describe("User Model", () => {
  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });

  it("should have a authenticate method", () => {
    expect(store.authenticate).toBeDefined();
  });

  it("should create a User", async () => {
    const result = await store.create({
      firstName: "Ernesto",
      lastName: "González",
      password: "pass123",
    });
    expect(result.firstName).toEqual("Ernesto");
    expect(result.id).toEqual(1);
    expect(result.lastName).toEqual("González");
  });
});
