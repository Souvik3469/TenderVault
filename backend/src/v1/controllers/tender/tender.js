import { PrismaClient } from "@prisma/client";
import { customResponse } from "../../../utils/Response";

const prisma = new PrismaClient();

const tenderController = {
  async createTender(req, res, next) {
    try {
      if (req.user.role !== "company") {
        return res.status(403).json({
          success: false,
          message: "Only companies are allowed to create tenders.",
        });
      }

      const { title, description, type, cost } = req.body;

      const newTender = await prisma.tender.create({
        data: {
          title,
          description,
          type,
          cost,
          companyId: req.user.id,
        },
      });

      return res.json({
        success: true,
        message: newTender,
      });
    } catch (error) {
      console.error("Error creating tender:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating the tender.",
        error: error.message,
      });
    } finally {
      await prisma.$disconnect();
    }
  },
   async getAllTenders(req, res, next) {
    try {

      const tenders = await prisma.tender.findMany();

      return res.json({
        success: true,
        message: tenders,
      });
    } catch (error) {
      console.error("Error fetching tenders:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching tenders.",
        error: error.message,
      });
    } finally {
      await prisma.$disconnect();
    }
  },
   async deleteTender(req, res, next) {
    try {
      const { id } = req.query;
      const userId = req.user.id;

      const tender = await prisma.tender.findUnique({
        where: {
          id: id,
        },
        include: {
          owner: true,
        },
      });

      if (!tender) {
        return res.status(404).json({
          success: false,
          message: "Tender not found.",
        });
      }

      if (tender.owner.id !== userId) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to delete this tender.",
        });
      }
      await prisma.tender.delete({
        where: {
          id: id,
        },
      });

      return res.json({
        success: true,
        message: "Tender deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting tender:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the tender.",
        error: error.message,
      });
    } finally {
      await prisma.$disconnect();
    }
  },
  async updateTender(req, res, next) {
    try {
      const { id } = req.query;
      const { title, description, type, cost } = req.body;
      const userId = req.user.id;
      const tender = await prisma.tender.findUnique({
        where: {
          id: id,
        },
        include: {
          owner: true,
        },
      });

      if (!tender) {
        return res.status(404).json({
          success: false,
          message: "Tender not found.",
        });
      }

      if (tender.owner.id !== userId) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to update this tender.",
        });
      }

      const updatedTender = await prisma.tender.update({
        where: {
          id: id,
        },
        data: {
          title: title,
          description: description,
          type: type,
          cost: cost,
        },
      });

      return res.json({
        success: true,
        message: updatedTender,
      });
    } catch (error) {
      console.error("Error updating tender:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the tender.",
        error: error.message,
      });
    } finally {
      await prisma.$disconnect();
    }
  },

};

export default tenderController;
