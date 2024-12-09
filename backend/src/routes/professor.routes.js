

import {Router} from "express";
import {createSlots, viewAppointments, deleteAppointments  } from "../controllers/professor.controller.js";



const router = Router();


router.route("/createSlots").post(createSlots);

router.route("/viewAppointments").post(viewAppointments);


router.route("/deleteAppointments").post(deleteAppointments);






export default router;