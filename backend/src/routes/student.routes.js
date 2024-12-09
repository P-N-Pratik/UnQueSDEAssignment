

import {Router} from "express";
import { viewSlots, bookAppointments} from "../controllers/student.controller.js";



const router = Router();


router.route("/viewSlots").post(viewSlots);


router.route("/bookAppointments").post(bookAppointments);





export default router;