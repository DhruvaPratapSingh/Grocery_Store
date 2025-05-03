
import User from "../models/User.js";
import bcrypt from "bcryptjs";
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


    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

    res.cookie('token',token,{
        httpOnly:true,//prevent js to access the cookie
        secure:process.env.NODE_ENV==='production', //use secure cookies in production
        sameSite:process.env.NODE_ENV==='production'?'none':'strict', //use none in production to allow cross site cookies
        maxAge:7*24*60*60*1000, // cookie will expire in 7 days
    });
    res.status(201).json({success:true,user:{name:user.name,email:user.email},token});
}
    catch(error){
        console.error(error.message);
        res.status(500).json({success:false,error:error.message});
    }

}


export const login=async (req, res) => {
try {
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({success:false,error:"email and password are required"})
    }
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({success:false,error:"Invalid credentials"})
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({success:false,error:"Invalid credentials"})
    }
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
    res.cookie('token',token,{
        httpOnly:true,//prevent js to access the cookie
        secure:process.env.NODE_ENV==='production', //use secure cookies in production
        sameSite:process.env.NODE_ENV==='production'?'none':'strict', //use none in production to allow cross site cookies
        maxAge:7*24*60*60*1000, // cookie will expire in 7 days
    });
    return res.status(200).json({success:true,user:{name:user.name,email:user.email},token});
} catch (error) {
    console.log(error.message);
    res.status(500).json({success:false,error:error.message});
}
}

// check auth

export const isAuth=async (req, res) => {
    try {
        const { id: userId } = req.user;
        const user=await User.findById(userId).select('-password');
        return res.status(200).json({success:true,user});
    }
    catch (error) {
        console.log(error.message);
        res.status(200).json({success:false,message:error.message});
    }
}

// logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
