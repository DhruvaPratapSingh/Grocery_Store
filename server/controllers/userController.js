
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



// /api/user/register
export const register=async (req, res) => {
    try{
   const {name,email,password}=req.body;
   if(!name || !email || !password){
       return res.status(400).json({success:false,error:"Please fill all the fields"})
    }
    const existingUser=await User.findOne({email});
    if(existingUser){
        return res.status(400).json({success:false,error:"User already exists"})
    }

    const hashedPassword=await bcrypt.hash(password,10);
    const user=await User.create({name,email,password:hashedPassword});
    res.status(201).json({success:true,user});


    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

    res.cookie('token',token,{
        httpOnly:true,//prevent js to access the cookie
        secure:process.env.NODE_ENV==='production', //use secure cookies in production
        sameSite:process.env.NODE_ENV==='production'?'none':'strict', //use none in production to allow cross site cookies
        maxAge:7*24*60*60*1000, // cookie will expire in 7 days
    });
    res.status(201).json({success:true,user:{name:user.name,email:user.email}},token);
}
    catch(error){
        console.error(error.message);
        res.status(500).json({success:false,error:error.message});
    }

}