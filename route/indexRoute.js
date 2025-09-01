const express = require("express");
const router = express.Router();


const authRoutes = require("./authroute");
const categorys=require('./categoryRoute.js');
const products=require('./productRoute.js')
const mountRouter=(app)=>{
   
    
    app.use('/api/v1/auth',authRoutes);
    app.use('/api/v1',categorys)
    app.use('/api/v1',products);


}



module.exports = mountRouter
;
