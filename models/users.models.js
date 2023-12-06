import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import  Jwt  from "jsonwebtoken";

const userSchema =  new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:[true, "email already taken"]
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minLength: [6, "password length should be greadter then 6 character"],
    },
    address:{
        type:String,
        required:[true,"addresss is required"]
    },
    city:{
        type:String,
        required:[true,"City is required"]
    },
    country:{
        type:String,
        required:[true,"Country is required"]
    },
    phone:{
        type:String,
        required:[true,"Phone Number is required"]
    },
    profilePic:{
       public_id:{
        type:String,
       },
       url:{
        type:String
       }
    },
    answer:{
        type:String,
        required:[true,"Answer is required"]
    },
    role:{
        type:String,
        default:'user'
    }
   
},{timestamps:true})
//Function to encrypt or hash the password
userSchema.pre('save',async function(next){
    if(!this.isModified("password"))return next()
    this.password =await bcrypt.hash(this.password,10)
});

//fjunction to decrypt or dehash the password
userSchema.methods.comparePassword = async function(plainPassword){
    return await bcrypt.compare(plainPassword, this.password);
}

userSchema.methods.generateAccessToken=  function(){
    return  Jwt.sign({
        _id: this._id,
      
    },process.env.ACCESS_TOKEN,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
    
}



export const User = mongoose.model("User",userSchema)
export default User;