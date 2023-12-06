import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connection.js";
import cookieParser from "cookie-parser";
import cloudinary from  'cloudinary'
import Stripe from "stripe";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize"
// dotenv.config({
//     path:'./env'
// })

dotenv.config()

//db connection
connectDB()
//Stripe Configuration
export const stripe = new Stripe(process.env.STRIPE_API_SECRET)
//cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
})
const app  =  express();
app.use(helmet());
app.use(mongoSanitize())
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({extended:true,limit:"16kb"}))
// const PORT =  4000;

// routes import
import testRoutes from "./routes/test.routes.js";
import userRoute from "./routes/users.routes.js"
import producRoute from "./routes/products.routes.js"
import categoryRoute from "./routes/category.routes.js"
import orderRoute from "./routes/orders.routes.js"
app.use("/api/v1", testRoutes);  
app.use("/api/v1/user", userRoute);  
app.use("/api/v1/product",producRoute);
app.use("/api/v1/category",categoryRoute);
app.use("/api/v1/order",orderRoute)

app.get("/",(req,res)=>{
    return res.status(200).send("Hii this is web server");

});
const port= process.env.PORT||5000
app.listen(port||3000,()=>{
    console.log(`Listening to port ${process.env.PORT} in ${process.env.NODE_ENV} stage`)
})
//ecommerce123 database password
//ved_shirgaonkar  ecommerce123 dbUser userid and pwd
