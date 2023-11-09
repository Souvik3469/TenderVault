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
router.get("/tenderdetails/:tenderId", authMiddleware, tenderController.getTenderDetails);
//router.get("/userdetails/:userId", authMiddleware, userController.getUserDetails);
router.post("/createtender", authMiddleware, tenderController.createTender);
router.delete("/deletetender", authMiddleware, tenderController.deleteTender);
router.put("/updatetender", authMiddleware, tenderController.updateTender);
router.put("/reviewtender", authMiddleware, tenderController.reviewTender);
router.get("/getalltender", authMiddleware, tenderController.getAllTenders);
router.get("/searchtender", authMiddleware, tenderController.searchTendersByName);
router.get("/getmytender", authMiddleware, tenderController.getMyTenders);
router.post("/createbid/:tenderId", authMiddleware, tenderController.createBid);
router.get("/getallbids/:tenderId", authMiddleware, tenderController.getallbids);
router.delete("/deletebid/:bidId", authMiddleware, tenderController.deleteBid);
router.put("/acceptbid/:bidId", authMiddleware, tenderController.acceptBid);
router.put("/rejectbid/:bidId", authMiddleware, tenderController.rejectBid);
export default router;
