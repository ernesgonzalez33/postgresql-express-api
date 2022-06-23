import Client from "../database";

export type Order = {
  id: number;
  user_id: number;
  status: string;
};

export class OrderStore {
  async currentOrderByUser(user_id: number): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM orders WHERE user_id=($1)";

      const result = await conn.query(sql, [user_id]);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders by user ${user_id}. Error: ${err}`);
    }
  }
}
