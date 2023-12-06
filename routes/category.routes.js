import  express  from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import { createCategoryController ,deletCategoryController,getAllCategoryController,updateCategoryController} from "../controllers/category.controllers.js";
 const router  = express.Router()
router.route("/createCategory").post(isAuth,createCategoryController)
router.route("/getAllCategory").get(getAllCategoryController)
router.route("/delete/:id").delete(isAuth,deletCategoryController)
router.route("/update/:id").put(isAuth,updateCategoryController)

export default router;