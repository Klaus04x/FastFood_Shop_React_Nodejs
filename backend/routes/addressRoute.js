import express from "express";
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from "../controllers/addressController.js";
import authMiddleware from "../middleware/auth.js";

const addressRouter = express.Router();

addressRouter.post("/list", authMiddleware, getAddresses);
addressRouter.post("/add", authMiddleware, addAddress);
addressRouter.post("/update", authMiddleware, updateAddress);
addressRouter.post("/delete", authMiddleware, deleteAddress);
addressRouter.post("/set-default", authMiddleware, setDefaultAddress);

export default addressRouter;
