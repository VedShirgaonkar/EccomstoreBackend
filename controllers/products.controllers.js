import Product from "../models/products.models.js";
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/features.utils.js";
export const getAllProducController =async(req,res)=>{
    const{keyword,category} =req.query

    try{
        const products =  await Product.find({
            name: {
                $regex: keyword ? keyword : "",
                $options: "i",
              },
        })
        res.status(200).send({
            success:true,
            message:"All products fetched successfully",
            products,
            totalProducts:products.length
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            err
        })
    }
}
export const getTopProductController=async(req,res)=>{
    try{
        const products = await Product.find({}).sort({rating:-1}).limit(3);
        res.status(200).send({
            succes:true,
            message:"Top 3 items",
            products,
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Error in get top products api",
            err
        })
    }
}

export const getSingleProduct=async(req,res)=>{
    try{
        const product  = await Product.findById(req.params.id) 
        if(!product)
        {
            res.status(500).send({
                success:false,
                message:"Could not Find prodict"
            })
        }
        res.status(200).send({
            success:true,
            message:"Product Found",
            product
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
//Create Product Controller

export const createProductController = async(req,res) =>{
    try{
        const {name,description,price,category,stock,quantity} = req.body;
        // if(!name || !description||!price||!stock){
        //     return res.status(500).send({
        //         success:false,
        //         message:"Item not Found"
                
        //     });
        //}
        if(!req.file){
            return res.status(500).send({
                success:false,
                message:"Admin Please upload the product image"
            })
        }
        const file  = getDataUri(req.file);
        const cloudinaryDataBase =  await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id:cloudinaryDataBase.public_id,
            url:cloudinaryDataBase.secure_url
        }
  
        
        await Product.create({
            name,
            description,
            price,
            category,
            stock,
           quantity,
            images:[image]
        })
        res.status(200).send({
            success:true,
            message:"Product Created Successfully"
        })
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            err
        })
    }
}

//Update Product
export const updateProductController=async(req,res)=>{
    try{
        const product  = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).send({
                success:false,
                message:"Product not Found"
            })
        }
        const {name,description,price,stock,category} = req.body;
        //validate and update
        if(name) product.name = name;
        if(description) product.description = description;
        if(price) product.price = price;
        if(stock) product.stock = stock;
        if(category) product.category = category;
        await product.save();
        res.status(200).send({
            success:true,
            message:"Product details updated Successfully"
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
//Update Product Image
export const updateproductImageController = async(req,res) =>{
    try{
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status(404).send({
                success:false,
                message:"Product not Found"
            });
        }
        if(!req.file){
            return res.status(500).send({
                success:false,
                mesage:"Product Image Not found"
            })
        }
        const file = getDataUri(req.file);
        const cloudinaryDataBase = await cloudinary.v2.uploader.upload(file.content);
        const image = {
            public_id:cloudinaryDataBase.public_id,
            url:cloudinaryDataBase.secure_url
        }
        product.images.push(image)
        await product.save();
        res.status(200).send({
            success:true,
            message:"Product Image updated SuccessFully"
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Something went wrong in updating product image",
            err
        })
    }
}


//delete product image
export const deleteProductImageController= async(req,res) =>{
    try{
        const product  = await Product.findById(req.params.id);
        if(!product)
        {
            return res.status(404).send({
                success:false,
                message:"Prooduct Not Found"
            })
        }
        //image ID Finding
        const id = req.query.id;
        if(!id){
            return res.status(404).send({
                success:false,
                message:"Product Image not Found"
            });
        }
        let isExists = -1; //whatever we will get in index we will do -1 to point on to proper index (maybe if index is starting from 0 check in the database document on mongodb) from that  therefore isExists is set to -1 
        product.images.forEach((item ,index)=>{
            if(item.id.toString()=== id.toString())isExists = index  //this is how index is being targeted by isExists
        })
        if(isExists<0)
        {
            return res.status(404).send({
                success:false,
                message:"Product Doesnot Exists"
            })
        }
        //delete Product image
        await cloudinary.v2.uploader.destroy(product.images[isExists].public_id)
        //with the help of slpice function whatever is the index position the product on that index will be deleted
        product.images.splice(isExists,1)
        await product.save();
        res.status(200).send({
            success:true,
            message:"product image deleted Successfully"
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Something went wrong  in deleting product image",
            err
        })
    }
}

//Delete Complete Product
export const deletProductController=async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if(!product)
        {
            return res.status(404).send({
                success:false,
                message:"Prooduct Not Found"
            })

        }
        //find and delete image from cloudinary
        for(let index = 0;index<product.images.length;index++)
        {
            await cloudinary.v2.uploader.destroy(product.images[index].public_id)
        }
        await product.deleteOne();
        res.status(200).send({
            success:false,
            message:"Product deleted Successfully"
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Something went wrong  in deleting product image",
            err
        })
    }
}

//Review Product
export const reviewProductController =async(req,res)=>{
    try{
        const{comment,rating} =req.body;
        //find Product
        const product = await Product.findById(req.params.id);
        //already reviewed
        const alreadyreviwed  = product.reviews.find((r)=> r.user.toString() === req.user._id.toString())
        if(alreadyreviwed){
            return res.status(400).send({
                success: false,
                message: "Product Alredy Reviewed",
              });
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
          };
          product.reviews.push(review);
          product.numReviews=product.reviews.length
          product.rating =product.reviews.reduce((acc,item)=>item.rating+acc,0)/product.reviews.length
          await product.save();
          res.status(200).send({
            success: true,
            message: "Review Added!",
          });
    }catch(error){
        console.log(error);
        // cast error ||  OBJECT ID
        if (error.name === "CastError") {
          return res.status(500).send({
            success: false,
            message: "Invalid Id",
          });
        }
        res.status(500).send({
          success: false,
          message: "Error In Review Comment API",
          error,
        });
    }
}