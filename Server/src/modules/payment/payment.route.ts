const express = require('express');
const paymentRouter = express.Router();

import { Router, Request as ExpressRequest, Response } from 'express';
import paymentController from '../payment/payment.controller';

// const paymentRouter = Router();

paymentRouter.post("/initiate", async (req: ExpressRequest, res: Response) => {
  await paymentController.initiatePayment(req, res);
});

paymentRouter.get("/verify/:reference", async (req: ExpressRequest, res: Response) => {
  await paymentController.verifyPayment(req, res);
});

export default paymentRouter;
