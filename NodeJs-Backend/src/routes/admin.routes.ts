import express from "express";
import { AdminController } from "../controllers";

const router = express.Router();

router.get("/users", AdminController.getAllUsers);

export default router;
