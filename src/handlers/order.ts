import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Order, OrderStore } from '../models/order';

const verifyAuthToken = (req: Request, res: Response, next: () => void) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader !== undefined) {
      const token = authorizationHeader.split(' ')[1];
      jwt.verify(token, process.env.TOKEN_SECRET as string);
    } else {
      throw new Error(`No authorization header`);
    }
    next();
  } catch (error) {
    res.status(401);
    res.json(error);
  }
};

const store = new OrderStore();

const create = async (req: Request, res: Response) => {
  const order: Order = {
    userId: req.body.userId,
    status: req.body.status
  };
  try {
    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (err) {
    res.status(400);
    res.json((err as string) + order);
  }
};

const addProduct = async (req: Request, res: Response) => {
  const orderId: number = parseInt(req.params.id);
  const productId: number = req.body.productId;
  const quantity: number = parseInt(req.body.quantity);

  try {
    const addedProduct = await store.addProduct(quantity, orderId, productId);
    res.json(addedProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const currentOrderByUser = async (req: Request, res: Response) => {
  const userId: number = parseInt(req.params.id);

  try {
    const newOrderProduct = await store.currentOrderByUser(userId);
    res.json(newOrderProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const orderRoutes = (app: express.Application) => {
  app.post('/orders', verifyAuthToken, create);
  app.post('/orders/:id/products', verifyAuthToken, addProduct);
  app.get('/users/:id/order', verifyAuthToken, currentOrderByUser);
};

export default orderRoutes;
