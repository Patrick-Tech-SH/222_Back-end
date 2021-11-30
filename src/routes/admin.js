const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const { response } = require("express")
const { admin,user} = new PrismaClient()
const {adminToken} = require("../middlewares/authen")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const fs = require("fs/promises")
const { set } = require("../../server")
const  logout  = require('../model/model');

router.get("/",adminToken, async (req, res) => {
    let totaladmin = await admin.findMany({

    })

     return res.send({ data:totaladmin })

})

router.put("/manage/:id",adminToken,async(req,res) =>{
    let id = req.params.id
    id = Number(id)
    const User = await user.findFirst({
        where: { userId: id }
    })
    if(User.status === false){
        await user.update({
            where:{
                userId:id
            },
            data:{
                status:true
            }
        })
    
        return res.send("Change status success")
    }
    else{
        await user.update({
            where:{
                userId:id
            },
            data:{
                status:false
            }
        })
    
        return res.send("Change status success")
    }
   
    
})

router.post('/login', async (req, res) => {
    console.log(req.ip)
    try {
        const { userName, password } = req.body;
        const existAdmin = await admin.findFirst({
            where: { userName: userName }
        })
        
        const validPassword =await bcrypt.compare(password,existAdmin.password)
        if (!(existAdmin && validPassword)) {
             return res.status(400).send("invalid Username or password")
        }
         delete existAdmin.password 
    const token =jwt.sign(existAdmin, process.env.Token_Key,{expiresIn:"30m"})
       return res.header("access-token",token).send({ adminId:existAdmin.adminId,token: token})

    } catch(error) {
        console.log(error)
     }     

})

router.post('/logout',adminToken,async(req,res) => {
    await logout.create({
        data:{
            token:req.token
        }
    })
    return res.status(200).send("Logout successfully")
})

router.get("/getuser",adminToken, async (req, res) => {
    let totaluser = await user.findMany({
        include: {
            cart:true
        }
    })

     return res.send({ data:totaluser })

})
module.exports = router