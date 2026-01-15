import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
} from "../controllers/users.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
router.get("/", authMiddleware, getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.delete("/:id", deleteUser);

export default router;