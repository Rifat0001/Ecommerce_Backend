import cors from 'cors';
import express, { Application, Request, Response, NextFunction } from 'express';
import { ProductRoutes } from './app/modules/Products/product.route';
import { OrderRoutes } from './app/modules/Orders/order.route';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes
app.use('/api', ProductRoutes);
app.use('/api', OrderRoutes);
// Default route
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to the Ecommerce Api Service',
  });
});

// Not Found Route
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

export default app;
