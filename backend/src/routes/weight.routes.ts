import { Router } from "express";
import {
  createWeightEntry,
  getWeightEntries,
  getWeightEntryById,
  deleteWeightEntry,
} from "../controllers/weight.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createWeightEntry);
router.get("/", getWeightEntries);
router.get("/:id", getWeightEntryById);
router.delete("/:id", deleteWeightEntry);

export default router;