const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const { response } = require("express")
const { admin,user} = new PrismaClient()
const authen = require("../middlewares/authen")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const fs = require("fs/promises")
const { set } = require("../../server")

router.get("/", async (req, res) => {
    let totaladmin = await admin.findMany({

    })

     return res.send({ data:totaladmin })

})

router.put("/manage/:id",async(req,res) =>{
    let id = req.params.id
    id = Number(id)

    // let {status} = req.body
   
     await user.update({
        where:{
            userId:id
        },
        data:{
            status:true
        }
    })

    return res.send("change status success")
})

module.exports = router