import jwt from "jsonwebtoken";

const authSeller=async (req,res,next)=>{
     const {sellerToken}=req.cookies;
     if(!sellerToken){
        return res.status(401).json({ success: false, error: "Unauthorized" });
     }

     try {
            const decoded = jwt.verify(selleToken, process.env.JWT_SECRET);
            // console.log(decoded.id);
            if(decoded.email === process.env.SELLER_EMAIL){
                next();
            }
            else{
                return res.status(401).json({ success: false, error: "Unauthorized" });
            }
        } catch (error) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }
}

export default authSeller;