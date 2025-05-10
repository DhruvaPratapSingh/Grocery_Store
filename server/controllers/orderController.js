import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import User from './../models/User.js';
export const placeOrderCOD=async (req, res) => {
    try {
        const { userId, items, address,cartItems } = req.body;
        if(!address || items.length===0){
            return res.status(400).json({success:false,message:"invalid data"});
        }

        // calculate Amoutn using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error("Product not found");
            }
            return (await acc) + product.price * item.quantity;
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
export const placeOrderStripe=async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        const{origin}=req.headers;
        if(!address || items.length===0){
            return res.status(400).json({success:false,message:"invalid data"});
        }
          let productData=[];
        // calculate Amoutn using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            if (!product) {
                throw new Error("Product not found");
            }
            return (await acc) + product.price * item.quantity;
        }, 0);
        // add tax
        amount += Math.floor(amount * 0.02); // 2% tax
        // create order
       const order = await Order.create({
            userId,
            items,
            address,
            amount,
            paymentType: "Online",
            // isPaid: true,
        });

        // create stripe session
        const stripeInstance =new stripe(process.env.STRIPE_SECRET_KEY);

        // create line items for stripe
        const line_items=productData.map((item)=>({
            price_data:{
                currency:"USD",
                product_data:{
                    name:item.name,
                },
                unit_amount: Math.floor(item.price+item.price*0.02)*100,
            },
            quantity:item.quantity,
        }));

        // create stripe session
        const session=await stripeInstance.checkout.sessions.create({
            // payment_method_types:["card"],
            mode:"payment",
            line_items,
            success_url:`${origin}/loader?next=my-orders`,
            cancel_url:`${origin}/cart`,
            metadata:{
                orderId:order._id.toString(),
                userId,
            },
        });

        return res.json({ success: true, url: session.url });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

// stripe webhook to verify payment /stripe
export const stripeWebhook=async (req, res) => {
    const stripeInstance =new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event= stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );  
    } catch (error) {
        console.log(error.message);
         res.status(400).send(`Webhook Error: ${error.message}`);
        
    }
    // Handle the event
    switch (event.type) {
        case "payment_intent.succeeded":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;
        //    getting session  metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,   
            });
            const {orderId, userId}=session.data[0].metadata;
            // update order
            await Order.findByIdAndUpdate(orderId,{isPaid:true});
            // clear cart
            await User.findByIdAndUpdate(userId,{cartItems:{}});
          break;
        }
        case "payment_intent.payment_failed":{
             const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;
        //    getting session  metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,   
            });
            const {orderId}=session.data[0].metadata;
            await Order.findByIdAndDelete(orderId);
            // clear cart
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
            break
    }
    res.json({recieved:true});

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
