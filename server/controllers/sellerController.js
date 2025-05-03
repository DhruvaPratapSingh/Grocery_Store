
import jwt from "jsonwebtoken"

// login seller /api/seller/login

export const sellerLogin = async (req, res) => {
  const {email, password } = req.body;

 try {
   if(password===process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){
      const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'7d'});
 
      res.cookie('sellerToken',token,{
       httpOnly:true,
       secure:process.env.NODE_ENV==='production', 
       sameSite:process.env.NODE_ENV==='production'?'none':'strict',
       maxAge:7*24*60*60*1000,
   });
  return res.status(200).json({success:true,message:"Login successful"});
   }
   else {
     return res.status(500).json({success:false,message:"wrong credentials"});
   }
 } catch (error) {
  console.log(error.message);
  res.status(500).json({success:false,error:error.message});
 }
}


// check seller auth

export const isSellerAuth=async (req, res) => {
    try {
        return res.status(200).json({success:true});
    }
    catch (error) {
        console.log(error.message);
        res.status(200).json({success:false,message:error.message});
    }
}


// logout
export const sellerLogout = async (req, res) => {
  try {
      res.clearCookie('sellerToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', 
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
      });
      return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
  }
};