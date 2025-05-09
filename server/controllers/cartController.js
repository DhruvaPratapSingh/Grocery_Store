
import User from "../models/User.js"


// /api/cart/update

// export const updateCart = async (req,res)=>{
//     try {
//         const {userId,cartItems}=req.body
//         await User.findByIdAndUpdate(userId,{cartItems});
//         res.json({success:true,message:"cart Updated"});
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({success:false,message:error.message});
//     }
// }
export const updateCart = async (req, res) => {
    try {
        const { userId, cartItems } = req.body;

        if (!userId || !cartItems) {
            return res.status(400).json({ success: false, message: "userId and cartItems are required" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { cartItems }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "Cart updated", cartItems: updatedUser.cartItems });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
