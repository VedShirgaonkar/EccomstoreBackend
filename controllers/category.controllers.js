import Category from "../models/category.models.js";
import Product from "../models/products.models.js";
export const createCategoryController = async(req,res)=>{
    try{
        const {category} = req.body;
        
        if(!category){
            res.status(404).send({
                success:false,
                message:"Please Provide Category name"
            })    
        }
        await Category.create({category});
        res.status(200).send({
            success:true,
            message:`${category}  Category created Successfully`
        })
    }catch(err){
    console.log(err);
        res.status(500).send({
            success:false,
            message:"Something went wrong  in Create Category Api",
            err
        })
    }
}   

//getAllCategoryController
export const getAllCategoryController=async(req,res)=>{
    try{
        const categories = await Category.find({})
        res.status(200).send({
            success:true,
            message:` these are all the categories`,
            totalCategories: categories.length,
            categories
        })
    }catch(err){
        res.status(500).send({
            success:false,
            message:" went wrong in Get All Products ApI"
        })
    }
}

export const deletCategoryController=async(req,res)=>{
    try{
        const category  =  await Category.findById(req.params.id);
        if(!category){
            return res.status(404).send({
                success:false,
                Message:"category not found"
            })
        }
        //find Products(there can be multiple products in single category eg samsung iphone nokia under mobile category) with category id
        const products  = await Product.find({category:category._id})
        //update Product Category
        for(let i =0;i<products.length;i++)
        {
            const product = products[i]
            product.category =undefined
            await product.save();
        }
        await category.deleteOne();
        res.status(200).send({
            success:true,
            message:"Category  deleted SuccessFully" 
        })
    }catch(err){
        if(err.name == "CastError"){
            res.status(500).send({
                success:false,
                message:"Invalid Id",
                err
            })
        }
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Something went wrong in Delete Category API",
            err
        })
    }
}

//update Category
export const updateCategoryController =async(req,res)=>{
    try{
        const category  =  await Category.findById(req.params.id);
        if(!category){
            return res.status(404).send({
                success:false,
                Message:"category not found"
            })
        }
        const {updadtedCategory} = req.body
        //find Products(there can be multiple products in single category eg samsung iphone nokia under mobile category) with category id
        const products  = await Product.find({category:category._id})
        //update Product Category
        for(let i =0;i<products.length;i++)
        {
            const product = products[i]
            product.category =updadtedCategory
            await product.save();
        }
        await category.save({category:updadtedCategory});
        res.status(200).send({
            success:true,
            message:"Category  deleted SuccessFully" 
        })
    }catch(err){
        if(err.name == "CastError"){
            res.status(500).send({
                success:false,
                message:"Invalid Id",
                err
            })
        }
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            err
        })
    }
}