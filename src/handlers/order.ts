import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Order, OrderProduct, OrderStore } from "../models/order";

const verifyAuthToken = (req: Request, res: Response, next: () => void) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader!.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);

    next();
  } catch (error) {
    res.status(401);
  }
};

const store = new OrderStore();

const create = async (req: Request, res: Response) => {
  const order: Order = {
    userId: req.body.userId,
    status: req.body.status,
  };
  try {
    const newOrder = await store.create(order);
    var token = jwt.sign(
      { order: newOrder },
      process.env.TOKEN_SECRET as string
    );
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json((err as string) + order);
  }
};

const addProduct = async (req: Request, res: Response) => {
  const orderId: number = parseInt(req.params.orderId);
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
  const orderProduct: OrderProduct = {
    quantity: req.body.quantity,
    productId: req.body.productId,
    orderId: req.body.orderId,
  };

  const userId: number = parseInt(req.params.userId);

  try {
    const newOrderProduct = store.currentOrderByUser(userId)
    res.json(newOrderProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const orderRoutes = (app: express.Application) => {
  app.post("/orders", create);
  app.post("/orders/:id/products", addProduct);
  app.get("/users/:id/order/:id", verifyAuthToken, currentOrderByUser);
};

export default orderRoutes;
