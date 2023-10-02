import express from "express";
import {
  userController,
} from "../controllers";
import authMiddleware from "../middlewares/Auth.middleware";
import tenderController from "../controllers/tender/tender";


const router = express.Router();

router.get("/user-details", authMiddleware, userController.userDetails);
router.post("/createtender", authMiddleware, tenderController.createTender);
router.delete("/deletetender", authMiddleware, tenderController.deleteTender);
router.put("/updatetender", authMiddleware, tenderController.updateTender);
router.get("/getalltender", authMiddleware, tenderController.getAllTenders);
export default router;
