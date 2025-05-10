import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const placeOrderCOD=async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        if(!address || items.length===0){
            return res.status(400).json({success:false,message:"invalid data"});
        }

        // calculate Amoutn using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error("Product not found");
            }
            return (await acc) + product.offerPrice * item.quantity;
        }, 0);
        // add tax
        amount += Math.floor(amount * 0.02); // 2% tax
        // create order
        await Order.create({
            userId,
            items,
            address,
            amount,
            paymentType: "COD",
            // isPaid: false,
        });
        return res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

// get order by user id
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    // console.log(userId);

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
    // console.log(orders);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// get all orders

export const getAllOrders=async(req,res)=>{
    try{
        const orders = await Order.find({
            $or:[{paymentType:"COD"},{isPaid:true}]
        }).populate("items.product address").sort({createdAt:-1});
        res.json({success:true,orders});
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({success:false,message:error.message})
    }
}
