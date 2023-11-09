import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { ZodError, z } from "zod";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import ms from "ms";
import { customResponse } from "../../../utils/Response";

const prisma = new PrismaClient();

const userController = {
 

  async userDetails(req, res, next) {
    try {
      let user;
      user = await prisma.user.findFirst({
        where: {
          id: req.user.id,
        },
      });
      res.json(customResponse(200, user));
    } catch (err) {
      res.json(customResponse(400, err));
      console.log(err, "err");
    }
  },
  async getVendors(req, res, next) {
  try {
    const vendors = await prisma.user.findMany({
      where: {
        role: "vendor",
      },
    });

    res.json(customResponse(200, vendors));
  } catch (err) {
    res.json(customResponse(400, err));
    console.log(err, "err");
  }
}
,
async getCompanies(req, res, next) {
  try {
    const companies = await prisma.user.findMany({
      where: {
        role: "company",
      },
    });

    res.json(customResponse(200, companies));
  } catch (err) {
    res.json(customResponse(400, err));
    console.log(err, "err");
  }
}

};
export default userController;
