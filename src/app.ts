import cors from "cors";
import express, { Application, Request, Response } from "express";
import { ProductRoutes } from "./app/modules/product.router";

const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

// application routes
app.use("/api", ProductRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("welcome to Ecommerce Api Service");
});

export default app;
