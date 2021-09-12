const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const { gamedeveloper } = new PrismaClient()



router.get("/", async (req, res) => {
    let id = req.params.id
    id = parseInt(id)
    let allGameDeveloper = await gamedeveloper.findMany({
        include: {
            keygames:true
        }
    })

     return res.send({ data: allGameDeveloper })

})
// router.get("/get/:id", async (req, res) => {
//     let id = req.params.id
//     id = parseInt(id)
//     let {devName} = req.body
//     if(!(devName)){
//         return res.send("Can not find user id.  Please check your user id !")
//     }
//     let allGameDeveloper = await gamedeveloper.findMany({
//         where:{
//             devId:id
//         },
//         include: {
//             keygames:id
//         }
//     })

//      return res.send({ data: allGameDeveloper })

// })


module.exports = router