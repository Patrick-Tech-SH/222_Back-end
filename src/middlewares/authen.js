const jwt = require('jsonwebtoken');
const { request } = require('../../server');
const  logout  = require('../model/model');
const config = process.env;

const userToken = async (req,res,next) =>{
    const token = await req.header('Authorization').replace('Bearer ', '')
    if(!token){
        return res.status(403).send("A token is required for authentication !")
    }
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
        const decoded = jwt.verify(token,config.Token_Key)
        req.user = decoded
        req.token= token
        console.log(req.user)
    } catch (error) {
        return res.status(401).send("Invalid Token !")
    }
    return next()
}
const adminToken = async (req,res,next) =>{
    const token = await req.header('Authorization').replace('Bearer ', '')
    if(!token){
        return res.status(403).send("A token is required for authentication !")
    }
    try {
        const decoded = jwt.verify(token,config.Token_Key)
        req.admin = decoded
    } catch (error) {
        return res.status(401).send("Invalid Token !")
    }
    return next()

}
module.exports = {userToken,adminToken}