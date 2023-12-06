import express from "express";
import { isAdmin, isAuth } from "../middlewares/auth.middleware.js";
import { adminchangeOrderStatusController, createOrderController, getAllordersAdminController, getMyOrderController, getSingleOrderDetails,paymentcontroller } from "../controllers/orders.controllers.js";
const router  =  express.Router();
router.route("/createOrder").post(isAuth,createOrderController)
router.route("/getmyorders").get(isAuth,getMyOrderController)
router.route("/getSingleorderDetails/:id").get(isAuth,getSingleOrderDetails)
router.route("/getPayment").post(isAuth,paymentcontroller)
router.route("/admin/get-all-orders").get(isAuth,isAdmin,getAllordersAdminController)
router.route("/admin/order/:id").put(isAuth,isAdmin,adminchangeOrderStatusController)
export default router;