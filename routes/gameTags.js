const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const { gametags } = new PrismaClient()



router.get("/", async (req, res) => {
    let allgametags = await gametags.findMany({
        include: {
            keycategory:true
        }
    })

     return res.send({ data: allgametags })

})

module.exports = router