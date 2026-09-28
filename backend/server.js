import express from 'express'
import app from "./src/app.js";
const ports = 3000


app.listen(ports,()=>{
    console.log(`server is connected ${ports}`)
})

