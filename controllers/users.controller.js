import  User  from "../models/users.models.js";
import {ApiError} from "../utils/ApiError.js"
import { getDataUri } from "../utils/features.utils.js";
import cloudinary from 'cloudinary';
//User registeration
export   const registerController=async (req,res)=>{
    try{
        const {name,email,password,address,city,country,phone,role,answer}=req.body
        //validation
        if(
            //[name,email,password,address,city,country,phone].some((field)=>field?.trim()==="" )
            !name ||
             !email ||
            !password ||
            !city ||
            !address ||
            !country ||
            !phone  ||
            !role  ||
            !answer
            ){
            //throw new ApiError(400,"Fields are required");
            //alternative long way is the below way to avoid this we wrote the APi Eror handling file ApiError.js
            return res.status(500).send({
                success: false,
                message: "Please Provide All Fields",
                
              });
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(500).send({
                success:false,
                message:"Email already taken"
            })
        }

        const user =await User.create({
            name,
            email,
            password,
            address,
            city,
            country,
            phone,
            role,
            answer
        });
        res.status(200).send({
            success:true,
            message:"Registeration SuccessFull ,please go Login",
            user,
            

        });
    }
    catch(error){
        console.log("Error Occcured is:",error)
        res.status(500).send({
            success:"false",
            message:"Internal Server error",
            error,
        })
    }
}
//User Login
export const loginController = async(req,res)=>{
    try{
        const{email,password} = req.body;
    if(!email || !password)
    {
        return res.status(500).send({
            success:false,
            message:"Enter valid data"
        })
    }
    const user = await User.findOne({email})
    if(!user)
    {
        return res.status(404).send({
            success:"false",
            Message:"user not Found",
        })
    }
    const isMatch = await user.comparePassword(password)
    if(!isMatch){
        return res.status(401).send({
            success:false,
            message:"Unauthorise Error:Invalid Credentials",
        })
    }
    const token  = await user.generateAccessToken();
    res.status(200).cookie("token",token,{
        
        expires:new Date(Date.now()+15*24*60*60*1000),
        secure:process.env.NODE_ENV === "devlopement"?true:false,
        httpOnly:process.env.NODE_ENV=== "devlopement"?true:false,
    }).send({
        success:true,
        message:"You are Logged In",
        token,
        user,
    })
   

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            error,
        })
    }

}

//USer Profile
export const getuserProfileController = async (req,res)=>{
    try{
        
        const user = await User.findById(req.user._id);
        res.status(200).send({
            success:true,
            message:"User profile fetched successfully",
            user
        })
    }catch(err){
        console.log(`the error is ${err}`)
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            
        })
    }
}
//User Logout
export const logoutUserController =async(req,res)=>{
    try{
        res.status(200).cookie("token"," ",{
        
            expires:new Date(Date.now()),
            secure:process.env.NODE_ENV === "devlopement"?true:false,
            httpOnly:process.env.NODE_ENV=== "devlopement"?true:false,
        }).send({
            success:true,
            message:"LoggedOut Successfullly"
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Something went wrong"
        })
    }
}

//Update User Profile
export const updateProfileController =async(req,res)=>{
    try{
        //Acccessing the document which we want to update
        const user = await User.findById(req.user._id)
        //getting the fields which user wants to update.
        const {name ,email,address,city,country,phone}  =  req.body
        if(name) user.name= name;
        if(email) user.email= email;
        if(address) user.address= address;
        if(city) user.city= city;
        if(country) user.country= country;
        if(phone) user.phone= phone;
        await user.save();
        res.status(200).send({
            success:true,
            message:"User Profile Updated Successfully"
        })

    }catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            message:"Something went wrong in update profile"
        })
    }

}

//update user password
export const updatePasswordController=async(req,res)=>{
    try{
        const user = await User.findById(req.user._id);
        const{oldPassword,newPassword} = req.body
        //validation
        if(!oldPassword || !newPassword)
        {
            return res.status(500).send({
                success:false,
                message:"please provide old or new password"
            });
        }
        const isMatch = await user.comparePassword(oldPassword);
            //validation
            if(!isMatch)
            {
                return res.status(500).send({
                    success:false,
                    message:"old Password is incorrect"
                })
            }
            user.password = newPassword;
            await user.save()
            res.status(200).send({
                success:true,
                message:"Password Updated SuccessFully"
            })
    }catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            message:"Something went wrong in update password"
        })
    }
}

//update user profile photo
export const updateProfilePictureController = async(req,res) =>{
        try{
            const user = await User.findById(req.user._id);
            //getting the file from client /user (getting the photo from user basically)
            const file = getDataUri(req.file);
            //delete the previous image
            await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
            //update
            const cloudinaryDataBase =  await cloudinary.v2.uploader.upload(file.content)
            user.profilePic = {
                public_id:cloudinaryDataBase.public_id,
                url : cloudinaryDataBase.secure_url
            }
            //save data
            await user.save()
            res.status(200).send({
                success:true,
                message:'profile picture updated'
            })
        }catch(err){
            console.log(err)
        res.status(500).send({
            success:false,
            message:"Something went wrong in update profile picture"
        })
        }
}

//Forgot password
export const resetPasswordController=async(req,res)=>{
    try{
        //user email && newPasword && answer
        const {email,newPassword,answer} =  req.body
        if(!email || !newPassword || !answer){
            return res.status(500).send({
                success:false,
                message:"Please Provide all details"
            })
        }
        const user = await User.findOne({email,answer})
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Invalid email or Password"
            })
        }
         
        user.password = newPassword;
        await user.save();
        res.status(200).send({
            success:true,
            message:'Your password has been reset please login'
        })
    }
    catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            message:"Something went wrong in update profile picture"
        })  
    }
}