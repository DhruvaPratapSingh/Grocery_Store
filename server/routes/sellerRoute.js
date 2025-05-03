

import express from "express"
import { isSellerAuth, sellerLogin, sellerLogout } from "../controllers/sellerController.js";
import authSeller from './../middleware/authSeller.js';

const sellerRouter = express.Router();
sellerRouter.post("/login",sellerLogin);
sellerRouter.get("/is-auth",authSeller,isSellerAuth);
sellerRouter.get("/logout",sellerLogout);


export default sellerRouter;