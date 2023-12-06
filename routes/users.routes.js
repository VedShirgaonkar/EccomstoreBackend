import express from "express"
import { Router } from "express"
import {
    getuserProfileController,
     loginController, 
     logoutUserController, 
     registerController,
     updateProfileController,
     updatePasswordController,
     updateProfilePictureController,
     resetPasswordController} from "../controllers/users.controller.js"
import { isAuth } from "../middlewares/auth.middleware.js"
import { singleUpload } from "../middlewares/multer.middlewares.js"
const router = Router()
router.route("/register").post(registerController);
router.route("/login").post(loginController);
router.route("/userprofile").get(isAuth,getuserProfileController);
router.route("/logout").get(isAuth,logoutUserController);
router.route("/updateprofile").put(isAuth,updateProfileController);
router.route("/updatepassword").put(isAuth,updatePasswordController);
router.route("/update-picture").put(isAuth,singleUpload,updateProfilePictureController)
router.route("/resetPassword").post(resetPasswordController)
export default router;