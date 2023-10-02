import express from "express";
import {
  userController,
} from "../controllers";
import authMiddleware from "../middlewares/Auth.middleware";
import tenderController from "../controllers/tender/tender";


const router = express.Router();

router.get("/user-details", authMiddleware, userController.userDetails);
router.post("/createtender", authMiddleware, tenderController.createTender);

export default router;
