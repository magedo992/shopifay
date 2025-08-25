const express =require('express');
require('dotenv').config();

const port=process.env.port;
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const cors=require('cors');

const app =express();
const db=require('./dbconfig/database');
const mountRouter = require('./route/indexRoute');
db.connectToDatabase();
app.use(express.json())
app.use(cors())


mountRouter(app);

const swaggerSpec = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((err,req,res,next)=>{
const message=err.message;
const statuscode=err.statusCode;
console.log(message);

res.status(statuscode).json({"message":message})
next();
})

app.listen(port,()=>{
    console.log(`server is listen on prot ${port}`);
    
})