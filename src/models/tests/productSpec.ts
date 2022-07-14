import { Product, ProductStore } from '../product';

const store = new ProductStore();

describe('Product Model', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should create a product', async () => {
    const result = await store.create({
      name: 'Jam',
      price: 20
    });
    expect(result.price).toEqual(20);
    expect(result.name).toEqual('Jam');
  });

  it('should show a Product', async () => {
    const result = await store.show('1');
    expect(result.id).toEqual(1);
  });

  it('should show a list of Products', async () => {
    const result = await store.index();
    expect(result).toBeInstanceOf(Array<Product>);
  });
});
