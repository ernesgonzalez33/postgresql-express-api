CREATE TABLE products (id SERIAL PRIMARY KEY, name VARCHAR(100), price INTEGER);
CREATE TABLE users (id SERIAL PRIMARY KEY, first_name VARCHAR(50), last_name VARCHAR(50), password_digest VARCHAR);
CREATE TYPE status AS ENUM ('active', 'complete');
CREATE TABLE orders (id SERIAL PRIMARY KEY, product_id INTEGER REFERENCES products(id), quantity INTEGER, user_id INTEGER REFERENCES users(id), status STATUS);