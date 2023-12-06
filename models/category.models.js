import mongoose from "mongoose";
const categorySchema = new mongoose.Schema(
    {
    category:{
        type:String,
        required:[true,"Category is required"]
    },
},
{timestamp:true}) 
export const Category  =  new mongoose.model("Category",categorySchema)
export default Category