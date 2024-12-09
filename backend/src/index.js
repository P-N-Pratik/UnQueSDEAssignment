import dotenv from "dotenv"
import connectionDB from "./db/index.js";
import {app} from "./server.js";

// Exportation for models----------

dotenv.config({
    path : './.env'
})


connectionDB()
.then(()=> {
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("Mongo DB Connection failed", err);

})