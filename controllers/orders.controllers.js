import Order from "../models/orders.models.js";
import Product from "../models/products.models.js";
import { stripe } from "../server.js";
export const createOrderController =async(req,res)=>{
    try{
        const {shippingInfo,orderItems,paymentMethod,paymentInfo,itemPrice,tax,ShippingCharges,totalAmount} =req.body
        if(!shippingInfo || !orderItems || !paymentMethod || !paymentInfo || !itemPrice || !tax || !ShippingCharges || !totalAmount ){
            return res.status(500).send({
                success:false,
                message:"Please Provide All the fields"
            })
        }
        await Order.create({
            user:req.user._id,
            shippingInfo,
            orderItems,
            paymentMethod,
            paymentInfo,
            itemPrice,
            tax,
            ShippingCharges,
            totalAmount
        })
    //Stok Update
      for(let i=0;i<orderItems.length;i++)
      {
        //find Product
        const products = await Product.findById(orderItems[i].products)
        products.stock-=orderItems[i].quantity; //whaterver is the ordered quantity subtract it from the product stock available
        await products.save();
      }  
      res.status(200).send({
        success:true,
        message:"Order placed Successfully",
        //totalAmount:tax+itemPrice+ShippingCharges
      })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Someting went wrong in creating Order API"
        })
    }
}


//Get All Order My Orders
export const getMyOrderController =async(req,res)=>{
    try {
        //finding orders using user id
        const orders =  await Order.find({user:req.user._id})
        if(!orders)
        {
            return res.status(500).send({
                success:false,
                message:"No order found"
            })
        }
        res.status(200).send({
            success:true,
            message:"Order Found",
            totalOrders : orders.length,
            orders
        })
    } catch (error) { 
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Someting went wrong in My Order API"
        })
    }
}

//Get Single Order getSingleorderDetails
export const getSingleOrderDetails=async(req,res)=>{
    try {
        //finding single product based on id
        const singleOrder = await Order.findById(req.params.id)
        if(!singleOrder){
            return res.status(500).send({
                success:false,
                message:"Order Not Found"
            })
        }
        res.status(200).send({
            success:true,
            message:"Order found here is your order",
            singleOrder
        })
    } catch (error) {
        console.log(err);
        if(err.name == "CastError"){
            res.status(500).send({
                success:false,
                message:"Invalid Id",
                err
            })
        }
        res.status(500).send({
            success:false,
            message:"Someting went wrong in My Order API"
        })
    }
}

//Accept Payment
export const paymentcontroller =async(req,res)=>{
    try{
        const {totalAmount} =req.body;
        if(!totalAmount){
            return res.status(404).send({
                success:false,
                message:"Total Amount is required",
            })
        }
      const {client_secret}=  await stripe.paymentIntents.create({
            amount:Number(totalAmount*100),
            currency:'usd'
        })
        res.status(200).send({
            success:true,
            message:"Payment Successful",
            client_secret
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Someting went wrong in My Order API"
        })
    }
}

//admin section
//get All orders
export const getAllordersAdminController=async(req,res)=>{
    try {
        const orders = await Order.find({});
        return res.status(200).send({
            success:true,
            message:"All orders data",
            totlaOrders: orders.length,
            orders
        })
    } 
    catch (err) {
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Someting went wrong in My Order API"
        })
    }
    
}
//change order status
export const adminchangeOrderStatusController =async(req,res)=>{
   try{
    const order = await Order.findById(req.params.id)
    if (!order){
        return res.status(404).send({
          success: false,
          message: "order not found",
        });
    }
    if (order.orderStatus === "processing") order.orderStatus = "shipped";
    else if (order.orderStatus === "shipped") {
      order.orderStatus = "deliverd";
      order.deliverdAt = Date.now();
    } else {
      return res.status(500).send({
        success: false,
        message: "order already deliverd",
      });
    }
    await order.save();
    res.status(200).send({
      success: true,
      message: "order status updated",
    });
   }catch(err){
    console.log(err);
    res.status(500).send({
        success:false,
        message:"Someting went wrong in My Order API"
    });
   }
}
