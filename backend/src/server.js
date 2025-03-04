

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true 
}))

app.use(express.json( { limit: "16kb"}));
app.use(express.urlencoded({extended:true, limit : "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());



// Routes Importation ------------


import authRouter from "./routes/auth.routes.js";
// import slotsAvailabilityRouter from "./routes/slots.js"
import studentRouter from "./routes/student.routes.js";
import professorRouter from "./routes/professor.routes.js";



// Routes declaration -----------------

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/professor", professorRouter);
// app.use("api/v1/slotsAvailability", slotsAvailabilityRouter)



export {app}


