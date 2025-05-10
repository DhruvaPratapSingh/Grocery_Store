
import express from 'express';
import { addAddress, getAddress } from '../controllers/addressController.js';
import authUser from '../middleware/authUser.js';
const addressRouter = express.Router();

addressRouter.post('/add',authUser,addAddress);
addressRouter.post('/get',authUser,getAddress);

export default addressRouter;