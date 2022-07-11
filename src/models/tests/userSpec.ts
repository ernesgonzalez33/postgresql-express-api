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

  it('should show a User', async () => {
    const result = await store.show("1");
    expect(result.firstName).toEqual("Ernesto");
    expect(result.id).toEqual(1);
    expect(result.lastName).toEqual("González");
  })

  it('should show a list of Users', async () => {
    const result = await store.index();
    expect(result).toBeInstanceOf(Array<User>);
  })

  it('should be able to authenticate', async () => {
    const result = await store.authenticate('1', "pass123");
    expect(result).not.toBeNull;
    expect(result!.firstName).toEqual("Ernesto");
    expect(result!.id).toEqual(1);
    expect(result!.lastName).toEqual("González");
  })
});
