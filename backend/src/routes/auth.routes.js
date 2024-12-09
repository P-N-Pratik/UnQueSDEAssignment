

import {Router} from "express";
import { loginUser, signInStudent, signInProfessor} from "../controllers/auth.controller.js";

const router = Router();

router.route("/signInStudent").post(signInStudent);

router.route("/signInProfessor").post(signInProfessor);

router.route("/login").post(loginUser);




export default router;