import  Jwt  from "jsonwebtoken";
import  User  from "../models/users.models.js";
//user middleware
export const isAuth=async(req,res,next)=>{
    try{
        const {token} =  req.cookies;
    if(!token)
    {
        return res.status(401).send({
            success:false,
            message:"Unauthorised user"
        })
    }
    const decodeData = Jwt.verify(token,process.env.ACCESS_TOKEN)
    req.user = await User.findById(decodeData._id);
    next();
    }catch(err){
        console.log(err)
        res.status(400).send({
            success:false,
            message:"Authentication failed"
        })
    }
}



//admin middleware
export const isAdmin = async(req,res,next)=>{
    if(req.user.role !== "admin"){
        return res.status(401).send({
            success:false,
            message:"U are not Admin"
        })
    }
    next();
}