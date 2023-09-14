import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { TransactionController } from "./controllers/TransactionController";
import { authMiddleware } from "./middlewares/auth";

const routes = Router();

const userController = new UserController();
const trController = new TransactionController();

routes.post("/login", userController.login);
routes.post("/user", userController.createUser);

routes.use(authMiddleware);

routes.get("/user", userController.getProfile);
routes.get("/user/:id", userController.getUserById);
routes.put("/user", userController.updateUser);
routes.delete("/user", userController.deleteUser);

routes.post("/transactions", trController.createTransaction);
routes.get("/transactions", trController.getAllTransactions);
routes.get("/transactions/:transactionId", trController.getTransactionById);
routes.put("/transactions/:transactionId", trController.updateTransaction);
routes.delete("/transactions/:transactionId", trController.deleteTransaction);

export default routes;
