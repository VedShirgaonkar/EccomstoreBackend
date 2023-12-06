import express from "express";
import { testController } from "../controllers/test.controllers.js";

//router object
const router = express.Router();

//routes
router.get("/tests", testController);

// export
export default router;