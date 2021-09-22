const jwt = require('jsonwebtoken');
const { request } = require('../../server');
const { findFirst } = require('../model/model');
const config = process.env;

const verifytoken = async (req,res,next) =>{
    const token  =  req.header('Authorization').replace('Bearer ','')
    if(!token){
        return res.status(403).send("A token is required for authentication !")
    }
    try {
        const decoded = jwt.verify(token,config.Token_Key)
        const user =  await findFirst({
            where:{
                userId:decoded.userId
            }
        })
        console.log(user)
        req.user = user
    } catch (error) {
        return res.status(401).send("Invalid Token !")
    }
    return next()

}
module.exports = verifytoken