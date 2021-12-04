const jwt = require('jsonwebtoken');
const { request } = require('../../server');
const  logout  = require('../model/model');


const userToken = async (req,res,next) =>{
    if(req.header('Authorization')==null){
        return res.status(403).send("A token is required for authentication !")
    }
    const token = await req.header('Authorization').replace('Bearer ', '')
    const  checklogout =  await logout.findFirst({
        where:{
            token:token
        }
    })
    console.log(checklogout)
    if(checklogout){
        return res.status(403).send("Please login again!")
    }
    try {
        const decoded = jwt.verify(token,process.env.TOKEN_KEY)
        req.user = decoded
        req.token= token
        console.log(req.user)
    } catch (error) {
        return res.status(401).send("Invalid Token !")
    }
    return next()
}
const adminToken = async (req,res,next) =>{
    if(req.header('Authorization')==null){
        return res.status(403).send("A token is required for authentication !")
    }
    const token = await req.header('Authorization').replace('Bearer ', '')
    const  checklogout =  await logout.findFirst({
        where:{
            token:token
        }
    })
    console.log(checklogout)
    console.log(token)
    if(checklogout){
        return res.status(403).send("Please login again!")
    }
    try {
        const decoded = jwt.verify(token,process.env.TOKEN_KEY)
        req.admin = decoded
        req.token= token
        console.log(req.admin)
    } catch (error) {
        return res.status(401).send("Invalid Token !")
    }
    return next()
}
module.exports = {userToken,adminToken}