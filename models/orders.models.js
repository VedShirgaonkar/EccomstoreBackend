import mongoose, { mongo } from "mongoose";
const orderSchema = new mongoose.Schema({
    shippingInfo:{
       address:{
        type:String,
       required:[true,"Address is required"]
       },
       cityName:{
            type:String,
            required:[true,"City is required"]
       },
       countryName:{
        type:String,
        required:[true,"Country name is required"]
       }
    },
    orderItems:[
        {
            name:{
                type:String,
                required:[true,"Product Name is required"]
            },
            Price:{
            type:Number,
            required:[true,"Product Price is required"]
        },
        quantity:{
            type:Number,
            required:[true,"Product Quantity is required"]
        },
        productImage:{
            type: String,
            required:[true,"Produc image is required"]   
        },
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:[true,"Product is required"]
        }
    }
    ],
    paymentMethod:{
        type:String,
        enum: ["COD","Online"],
        default:"COD"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,"User id is required"]
    },
    paidAt:Date,
    paymentInfo:{
        id:String,
        status:String
    },
    itemPrice:{
        type:Number,
        required:[true,"Item Price is required"]
    },
    tax:{
        type:Number,
        required:[true,"tax Price is required"]
    },
    ShippingCharges:{
        type:Number,
        required:[true,"ShippingCharges  is required"]
    },
    totalAmount:{
        type:Number,
        required:[true,"Total Amount  Price is required"]
    },
    orderStatus: {
        type: String,
        enum: ["processing", "shipped", "deliverd"],
        default: "processing",
      },
      deliverdAt: Date,
},{timestamps:true})
export const Order = new mongoose.model("Order",orderSchema)
export default Order;