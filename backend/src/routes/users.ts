import { Router } from 'express';
import { auth, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
const r=Router();
r.get('/me',auth,async(req:AuthRequest,res)=>{const u=await User.findById(req.userId).select('-passwordHash');res.json({success:true,data:u});});
r.put('/me',auth,async(req:AuthRequest,res)=>{const u=await User.findByIdAndUpdate(req.userId,req.body,{new:true}).select('-passwordHash');res.json({success:true,data:u,message:'Profile updated'});});
export default r;
