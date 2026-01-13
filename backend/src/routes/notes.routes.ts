import { Router } from "express";
import { getNotes } from "../controllers/notes.controller";

const router = Router();

router.get("/", getNotes);

export default router;