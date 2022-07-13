# Storefront Backend Project

This repo contains the of a Storefront backend that lets you create users, orders and products and even find and order of a certain user if it is active.

## How to use

1. First clone the repo:

```
$ git clone git@github.com:ernesgonzalez33/postgresql-express-api.git
$ cd postgresql-express-api
```

2. Install all required packages:

```
$ npm install
```

3. Create a .env file with the following structure:

```
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=storefront_db
POSTGRES_TEST_DB=storefront_db_test
POSTGRES_USER=storefront_user
POSTGRES_PASSWORD=<your-password>
BCRYPT_PASSWORD=<your-bcrypt-password>
SALT_ROUNDS=10
ENV=dev
TOKEN_SECRET=<your-token-secret>
```

> NOTE: You can change the names of the databases.

4. Spin up the database

```
$ docker-compose up
```

5. In another terminal, run the migration:

```
$ db-migrate up
```

5. Build the code

```
$ npm run build
```

6. Run the server

```
$ node dist/server.js
```

Now you can use the API with the endpoints specificied in the [REQUIREMENTS.md](./REQUIREMENTS.md).

## How to run the tests

For running the tests, it is imperative that you connect to the postgres image, create the database that is in the `.env` file inside the environment variable called `POSTGRES_TEST_DB`.

```bash
$ psql -h ${POSTGRES_HOST} -p 5432 -U ${POSTGRES_USER} ${POSTGRES_DB}
# <introduce the password for the user>
$ create database <POSTGRES_TEST_DB>
```

After that, you can run the test with:

```
$ npm run test
```