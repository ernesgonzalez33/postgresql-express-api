import Client from "../database";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  password: string;
};

dotenv.config()
const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS as unknown as string;

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM users";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: string): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM users WHERE id=($1)";

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }

  async create(u: User): Promise<User> {
    try {
      const sql =
        "INSERT INTO users (first_name, last_name, password_digest) VALUES($1, $2, $3) RETURNING *";

      const conn = await Client.connect();

      const hash = bcrypt.hashSync(
        u.password + pepper, 
        parseInt(saltRounds)
      );

      const result = await conn.query(sql, [u.firstName, u.lastName, hash]);
      const user= result.rows[0];

      // Convert the result to Camel Case again
      const userNew = {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        password: user.password_digest
      }

      conn.release();

      return userNew

    } catch (err) {
      throw new Error(`Could not add new user ${u.firstName}. Error: ${err}`);
    }
  }

  async authenticate(id: number, password: string): Promise<User | null> {
    const conn = await Client.connect();
    const sql = 'SELECT password_digest FROM users WHERE user_id=($1)';

    const result = await conn.query(sql, [id]);

    if(result.rows.length) {

      const user = result.rows[0];

      if (bcrypt.compareSync(password+pepper, user.password_digest)) {
        return user;
      }
    }

    return null;
  }
}
