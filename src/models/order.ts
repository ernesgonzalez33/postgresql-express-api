import Client from "../database";
import { Product } from "./product";

export type Order = {
  id?: number;
  userId: number;
  status: string;
};

export type OrderProduct = {
  id?: number;
  quantity: number;
  productId: number;
  orderId: number;
}

// Function to convert orders from PSQL queries to camelCase
function convertOrderToCamelCase(sqlOrder: {id: number, user_id: number, status: string}): Order {
  const orderNew = {
    id: sqlOrder.id,
    userId: sqlOrder.user_id,
    status: sqlOrder.status
  }
  return orderNew;
}

function convertOrderProductToCamelCase(sqlOrderProduct: {id: number, quantity: number, product_id: number, order_id: number}): OrderProduct {
  const orderProductNew = {
    id: sqlOrderProduct.id,
    quantity: sqlOrderProduct.quantity,
    productId: sqlOrderProduct.product_id,
    orderId: sqlOrderProduct.order_id
  }
  return orderProductNew;
}

export class OrderStore {
  async currentOrderByUser(userId: number): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM orders WHERE user_id=($1) AND status='active'";

      const result = await conn.query(sql, [userId]);

      conn.release();

      return convertOrderToCamelCase(result.rows[0]);
    } catch (err) {
      throw new Error(`Could not get current order by user ${userId}. Error: ${err}`);
    }
  }

  async create(o: Order): Promise<Order> {
    try {
      const sql =
        "INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *";

      const conn = await Client.connect();

      const result = await conn.query(sql, [
        o.userId,
        o.status,
      ]);

      const order = convertOrderToCamelCase(result.rows[0]);

      conn.release();

      return order;
    } catch (err) {
      throw new Error(`Could not create new order. Error: ${err}`);
    }
  }

  async addProduct(quantity: number, orderId: number, productId: number): Promise<OrderProduct> {
    try {
      const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'

      const conn = await Client.connect()

      const result = await conn
          .query(sql, [quantity, orderId, productId])

      const order = convertOrderProductToCamelCase(result.rows[0]);

      conn.release()

      return order
    } catch (err) {
      throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`)
    }
  }
}
