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

// Function to convert users from PSQL queries to camelCase
function convertUserToCamelCase(sqlUser: {id: number, first_name: string, last_name: string, password_digest: string}): User {
  const userNew = {
    id: sqlUser.id,
    firstName: sqlUser.first_name,
    lastName: sqlUser.last_name,
    password: sqlUser.password_digest
  }
  return userNew;
}

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM users";

      const result = await conn.query(sql);

      conn.release();

      // Convert results from the query to camelCase
      const users: User[] = [];

      for(var user of result.rows){
        users.push(convertUserToCamelCase(user));
      }

      return users;
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

      return convertUserToCamelCase(result.rows[0]);
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

      conn.release();

      return convertUserToCamelCase(user);

    } catch (err) {
      throw new Error(`Could not add new user ${u.firstName}. Error: ${err}`);
    }
  }

  async authenticate(id: string, password: string): Promise<User | null> {
    const conn = await Client.connect();
    const sql = 'SELECT * FROM users WHERE id=($1)';

    const result = await conn.query(sql, [id]);

    if(result.rows.length) {

      const user = result.rows[0];

      if (bcrypt.compareSync(password+pepper, user.password_digest)) {
        return convertUserToCamelCase(user);
      }
    }

    return null;
  }
}
