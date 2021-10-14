const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const { keycategory,keygames } = new PrismaClient()
const dayjs = require("dayjs")
const { request } = require("../../server")


router.get("/", async (req, res) => {
    let allcatagory = await keycategory.findMany({
        include: {
            keygames:true,
            gametags:true
        }
    })
    allcatagory.forEach(item => {
        item.keygames.releaseDate = dayjs(item.keygames.releaseDate).format("DD/MM/YYYY")  
    });
     return res.send({ data: allcatagory })

})

module.exports = router