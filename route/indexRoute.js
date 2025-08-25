const express = require("express");
const router = express.Router();


const authRoutes = require("./authroute");
const mountRouter=(app)=>{
   
    
    app.use('/api/v1/auth',authRoutes);


}



module.exports = mountRouter
;
