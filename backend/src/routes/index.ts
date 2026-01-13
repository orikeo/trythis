import { Router } from "express";
import usersRoutes from "./users.routes";
import notesRoutes from "./notes.routes";

const router = Router();

router.use("/users", usersRoutes);
router.use("/notes", notesRoutes);

export default router;