const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const { response } = require("express")
const { admin,user} = new PrismaClient()
const authen = require("../middlewares/authen")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const fs = require("fs/promises")

router.get("/", async (req, res) => {
    let totaladmin = await admin.findMany({

    })

     return res.send({ data:totaladmin })

})

router.delete("/del/:id",async(req,res) =>{
    let id = req.params.id
    id = parseInt(id)
   
    let result = await user.deleteMany({
        where:{
            userId:id
        }
    })
    if(result.count==0){
        return res.send("Delete faild please check your user id!")
    }
    return res.send("Delete success ")
})

module.exports = router