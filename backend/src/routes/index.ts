import { Router } from "express";
import usersRoutes from "./users.routes";
import notesRoutes from "./notes.routes";
import authRoutes from "./auth.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/notes", notesRoutes);

export default router;