import express from "express";
import {
  userController,
} from "../controllers";
import authMiddleware from "../middlewares/Auth.middleware";
import tenderController from "../controllers/tender/tender";


const router = express.Router();

router.get("/user-details", authMiddleware, userController.userDetails);
router.get("/getvendors", authMiddleware, userController.getVendors);
router.get("/getcompany", authMiddleware, userController.getCompanies);
router.get("/getcategory", authMiddleware, tenderController.getAllCategories);
router.post("/createtender", authMiddleware, tenderController.createTender);
router.delete("/deletetender", authMiddleware, tenderController.deleteTender);
router.put("/updatetender", authMiddleware, tenderController.updateTender);
router.get("/getalltender", authMiddleware, tenderController.getAllTenders);
router.get("/getmytender", authMiddleware, tenderController.getMyTenders);
router.post("/createbid", authMiddleware, tenderController.createBid);
router.get("/getallbids", authMiddleware, tenderController.getallbids);
export default router;
