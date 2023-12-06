import express from "express";
import { createProductController, getAllProducController,getSingleProduct, updateProductController,updateproductImageController,deleteProductImageController,deletProductController, reviewProductController, getTopProductController} from "../controllers/products.controllers.js";
import { isAuth } from "../middlewares/auth.middleware.js"
import { singleUpload } from "../middlewares/multer.middlewares.js"
const router=express.Router()
router.route("/get-AllProducts").get(getAllProducController)
router.route("/getTopProduct").get(getTopProductController)
router.route("/:id").get(getSingleProduct)
router.route("/createProduct").post(isAuth,singleUpload,createProductController)
router.route("/:id").put(isAuth,updateProductController)
router.route("/productimage/:id").put(isAuth,singleUpload,updateproductImageController)
router.route("/deleteProductimage/:id").delete(isAuth,deleteProductImageController)
router.route("/deleteProduct/:id").delete(isAuth,deletProductController)
router.route("/:id/reviewproduct").put(isAuth,reviewProductController)
export default router;