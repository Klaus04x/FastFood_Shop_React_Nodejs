import express from "express";
import { getStatistics, getDailyRevenue, getMonthlyRevenue } from "../controllers/statisticsController.js";

const statisticsRouter = express.Router();

statisticsRouter.get("/summary", getStatistics);
statisticsRouter.get("/daily", getDailyRevenue);
statisticsRouter.get("/monthly", getMonthlyRevenue);

export default statisticsRouter;
