import { Order, OrderStore } from '../order';
import { ProductStore } from '../product';
import { UserStore } from '../user';

const userStore = new UserStore();
const orderStore = new OrderStore();
const productStore = new ProductStore();

describe('Order Model', () => {
  it('should have a Current Order by User method', () => {
    expect(orderStore.currentOrderByUser).toBeDefined();
  });

  it('should create a user, a product and an order', async () => {
    await userStore.create({
      firstName: 'John',
      lastName: 'Doe',
      password: 'pass123'
    });
    await productStore.create({
      name: 'Rubber Duck',
      price: 25
    });
    const order = await orderStore.create({
      userId: 1,
      status: 'active'
    });
    expect(order.status).toEqual('active');
  });

  it('should add a product to the order', async () => {
    const orderProduct = await orderStore.addProduct(15, 1, 1);
    expect(orderProduct.quantity).toEqual(15);
  });
});
