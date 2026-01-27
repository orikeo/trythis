import { Router } from "express";
import {
  createNote,
  getNotes,
  getNoteById,
  deleteNote,
} from "../controllers/notes.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createNote);
router.get("/", getNotes);
router.get("/:id", getNoteById);
router.delete("/:id", deleteNote);

export default router;