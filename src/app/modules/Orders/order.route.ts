import express from 'express';
import { orderControllers } from './order.controller';
const router = express.Router();

router.get('/orders', orderControllers.searchOrders);

router.post('/orders', orderControllers.createOrderController);

export const OrderRoutes = router;
