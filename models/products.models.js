import mongoose from "mongoose";
//Review model
const reviewSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"]
    },
    rating:{
        type:Number,
        default:0
    },
    comment:{
        type:String,

    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,"User  is required"]
    }
},{timestamps:true})



//Product Model
const productSchema  =  new mongoose.Schema({
    name:{
        type:String,
        required:[true,"product name is required"]
    }
,
description:{
    type:String,
    required:[true,"product ddescription is required"]
},
price:{
    type:Number,
    required:[true,"product price is required"]
},
stock:{
    type:Number,
    required:[true,"Product stock is required"]
},
quantity:{
    type:Number,
    required:[true,"Product quantity is required"]
},
category:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Category",
},
images:[
    {public_id:String,
    url:String},
],
reviews:[reviewSchema],
rating:{
    type:Number,
    default:0
},
numReviews:{
    type:Number,
    default:0
}

},{timestamps:true})
export const Product = mongoose.model("Product",productSchema)
export default Product;