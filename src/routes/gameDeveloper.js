const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const { gamedeveloper } = new PrismaClient()



router.get("/", async (req, res) => {
    let allGameDeveloper = await gamedeveloper.findMany({
        include: {
            keygames:true
        }
    })
     return res.send({ data: allGameDeveloper })

})

module.exports = router