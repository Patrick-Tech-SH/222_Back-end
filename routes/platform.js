const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const { platform } = new PrismaClient()



router.get("/", async (req, res) => {
    let allplatform = await platform.findMany({
        include: {
            keygames:true
        }
    })

     return res.send({ data: allplatform })

})

module.exports = router