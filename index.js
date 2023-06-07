const exp = require('constants');
const express = require('express');
const app = express();
const bodyParse  = require('body-parser');
const cors = require('cors');
const api = require('./routers/api.router');
const port =8088;
app.use(bodyParse.json({limit:"50mb"}));
app.use(bodyParse.urlencoded({extended:true,limit:"50mb"}))
require('./config/dbconfig');
app.use('/api',api);
app.listen(port,(req,res)=>{
    console.log(`server running on ${port}`)
})