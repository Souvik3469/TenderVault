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

      const { title, description, category, cost,imageUrl } = req.body;

      const newTender = await prisma.tender.create({
        data: {
          title,
          description,
          category,
          cost,
          imageUrl,
            companyName:req.user.name,
           owner: {
          connect: { id: req.user.id } 
        },
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
  async searchTendersByName(req, res, next) {
  try {
    const { name } = req.query;

   
    const matchingTenders = await prisma.tender.findMany({
      where: {
        title: {
          contains: name,
        },
      },
    });

    res.json({
      success: true,
      message: "Tenders retrieved successfully",
      data: matchingTenders,
    });
  } catch (error) {
    console.error("Error searching tenders by name:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while searching for tenders by name.",
      error: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
}
,
  async getMyTenders(req, res, next) {
  try {
    if (req.user.role !== "company") {
      return res.json(customResponse(403, "Only companies are allowed to view their tenders."));
    }

    const companyId = req.user.id;

    const myTenders = await prisma.tender.findMany({
      where: {
        companyId,
      },
    });

    res.json({
      success: true,
      message: "Your tenders retrieved successfully",
      data: myTenders,
    });

  } catch (error) {
    console.error("Error getting my tenders:", error);
    res.json({
      success: false,
      message: "Internal server error",
      data: error,
    });
  } finally {
    await prisma.$disconnect();
  }
}
,
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
      const { title, description, category, cost,status } = req.body;
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
          category: category,
          cost: cost,
          status:status
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
  async reviewTender(req, res, next) {
  try {
    const { rating } = req.body; 
    const tenderId = req.query.id; 
    const userId = req.user.id;


    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can review tenders.",
      });
    }

   
    const tender = await prisma.tender.findUnique({
      where: {
        id: tenderId,
      },
    });

    if (!tender) {
      return res.status(404).json({
        success: false,
        message: "Tender not found.",
      });
    }

    const reviewedTender = await prisma.tender.update({
      where: {
        id: tenderId,
      },
      data: {
        rating: rating,
      },
    });

    return res.json({
      success: true,
      message: "Tender reviewed successfully",
      data: reviewedTender,
    });

  } catch (error) {
    console.error("Error reviewing tender:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while reviewing the tender.",
      error: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
},
  async getTenderDetails(req, res, next) {
  try {
    const tenderId = req.params.tenderId; 

    const tender = await prisma.tender.findUnique({
      where: {
        id: tenderId,
      },
    });

    if (!tender) {
      return res.json(customResponse(404, "Tender not found"));
    }

    res.json({
      success: true,
      message: "Tender details retrieved successfully",
      data: tender,
    });
  } catch (error) {
    console.error("Error getting tender details:", error);
    res.json({
      success: false,
      message: "Internal server error",
      data: error,
    });
  } finally {
    await prisma.$disconnect();
  }
},

async createBid(req, res, next) {
  try {
    const { amount } = req.body;
    const vendorId = req.user.id;
    const tenderId = req.params.tenderId;

    if (req.user.role !== "vendor") {
      return res.json(customResponse(403, "Only vendors can create bids"));
    }

    const tenderRecord = await prisma.tender.findUnique({
      where: {
        id: tenderId,
      },
    });

    if (!tenderRecord) {
      return res.json(customResponse(404, "Tender not found"));
    }

   
    if (tenderRecord.status !== "unsold") {
      return res.json(customResponse(400, "Tender is closed for bids"));
    }

  
    if (amount < tenderRecord.cost) {
      return res.json(customResponse(400, "Bidding amount must be greater than or equal to the cost of the tender"));
    }

 
    const newBid = await prisma.bid.create({
      data: {
        amount: amount,
        tender: { connect: { id: tenderRecord.id } },
        company: { connect: { id: tenderRecord.companyId } }, 
        vendor: { connect: { id: vendorId } }, 
        
        status: "pending", 
      },
    });

    res.json({
      success: true,
      message: "Bid created successfully",
      data: newBid,
    });

  } catch (error) {
    console.error("Error creating bid:", error);
    res.json({
      success: false,
      message: "Internal server error",
      data: error,
    });
  } finally {
    await prisma.$disconnect();
  }
}
,
async getallbids(req, res, next) {
  try {
    const tenderId = req.params.tenderId; 
    const tenderRecord = await prisma.tender.findUnique({
      where: {
        id: tenderId,
      },
    });

    if (!tenderRecord) {
      return res.json(customResponse(404, "Tender not found"));
    }

    const bids = await prisma.bid.findMany({
      where: {
        tenderId: tenderRecord.id,

      },
      include:{
        vendor:true
      }
    });

    res.json({
      success: true,
      message: "Bids retrieved successfully",
      data: bids,
    });

  } catch (error) {
    console.error("Error getting bids for tender:", error);
    res.json({
      success: false,
      message: "Internal server error",
      data: error,
    });
  } finally {
    await prisma.$disconnect();
  }
}
,
async deleteBid(req, res, next) {
  try {
    const bidId = req.params.bidId; 
    const userId = req.user.id; 

   
    const bid = await prisma.bid.findUnique({
      where: {
        id: bidId,
      },
      include: {
        vendor: true,
      },
    });

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "Bid not found.",
      });
    }

   
    if (bid.vendor.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this bid.",
      });
    }


    await prisma.bid.delete({
      where: {
        id: bidId,
      },
    });

    return res.json({
      success: true,
      message: "Bid deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting bid:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the bid.",
      error: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
}
,
async acceptBid(req, res, next) {
  try {
    const { bidId } = req.params;
    const userId = req.user.id;

    const bid = await prisma.bid.findUnique({
      where: {
        id: bidId,
      },
      include: {
        tender: {
          include: {
            owner: true,
          },
        },
        vendor: true,
      },
    });

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "Bid not found.",
      });
    }

    if (bid.tender.companyId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to accept this bid.",
      });
    }

    if (bid.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only bids with 'pending' status can be accepted.",
      });
    }


    const acceptedBid = await prisma.bid.update({
      where: {
        id: bidId,
      },
      data: {
        status: "accepted",
      },
    });


    const updatedTender = await prisma.tender.update({
      where: {
        id: bid.tenderId,
      },
      data: {
        status: "sold",
        buyerId: bid.vendorId,
      },
    });

    res.json({
      success: true,
      message: "Bid accepted successfully.",
      data: {
        acceptedBid,
        updatedTender,
      },
    });

  } catch (error) {
    console.error("Error accepting bid:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while accepting the bid.",
      error: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
},
async rejectBid(req, res, next) {
  try {
    const { bidId } = req.params;
    const userId = req.user.id;

    const bid = await prisma.bid.findUnique({
      where: {
        id: bidId,
      },
      include: {
        tender: {
          include: {
            owner: true,
          },
        },
        vendor: true,
      },
    });

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "Bid not found.",
      });
    }
        if (bid.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only bids with 'pending' status can be accepted.",
      });
    }

    if (bid.tender.companyId!== userId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to reject this bid.",
      });
    }

    const rejectedBid = await prisma.bid.update({
      where: {
        id: bidId,
      },
      data: {
        status: "rejected",
      },
    });

    res.json({
      success: true,
      message: "Bid rejected successfully.",
      data: rejectedBid,
    });

  } catch (error) {
    console.error("Error rejecting bid:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while rejecting the bid.",
      error: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
}
,
 async getAllCategories(req, res, next) {
    try {
      const categories = await prisma.tender.findMany({
        select: {
          category: true,
        },
      });

      const uniqueCategories = Array.from(new Set(categories.map((tender) => tender.category)));

      res.json({
        success: true,
        message: "Categories retrieved successfully",
        data: uniqueCategories,
      });
    } catch (error) {
      console.error("Error getting categories:", error);
      res.json({
        success: false,
        message: "Internal server error",
        data: error,
      });
    } finally {
      await prisma.$disconnect();
    }
  }

};

export default tenderController;
