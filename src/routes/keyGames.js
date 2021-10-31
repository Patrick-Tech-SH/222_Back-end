const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const { keygames,cart,keycategory,gametags } = new PrismaClient()
const dayjs = require("dayjs")
const { request } = require("../../server")

router.get("/", async (req, res) => {
    let totalkeygames = await keygames.findMany({
        include: {
            gamedeveloper:true,
            platform:true,
            keycategory:{include:{gametags:{select:{tagName:true}}}} ,
            cart:true
           
        }
    })
    totalkeygames.forEach(item => {
        item.releaseDate = dayjs(item.releaseDate).format("DD/MM/YYYY")  
    });
    
     return res.send({ data: totalkeygames })

})
router.post("/add",async(req,res) =>{
    let {gameName,gameDetail,price,releaseDate,images,gamedeveloper_devId,Platform_pId,user_userId,gametags} = req.body
    if(!(gameName&&gameDetail&&price&&releaseDate&&images&&gamedeveloper_devId&&Platform_pId&&user_userId)){
        return res.send("Please check youu data again!!")
    }
    releaseDate =  new Date(releaseDate)
    
    let keygameObject =  {gameName,gameDetail,price,releaseDate,images,gamedeveloper_devId,Platform_pId,user_userId}
    
    let result = await keygames.create({
        data: keygameObject
    })
    console.log(result)
   for(let i = 0; i<gametags.length; i++){
       await keycategory.createMany({
           data: {
               keygames_keyID:result.keyId,
               gametags_tagId:gametags[i].id

           }
       })
   }

    return res.send("Add success ")
})

router.put("/update/:id",async(req,res) =>{
    let id = req.params.id
    id = Number(id)
    let {gameName,gameDetail,price,releaseDate,images,gameDeveloper_devId,Platform_pId} = req.body
    releaseDate =  new Date(releaseDate)
    let keygameObject =  {gameName,gameDetail,price,releaseDate,images,gameDeveloper_devId,Platform_pId}
    let result = await keygames.updateMany({
        where :{
            keyId:id
        },
        data: keygameObject
    })
    if((result.count==0)){
        return res.send("Can not find user id.  Please check your user id !")
    }
    res.send("Update Successfully")
    console.log(result)
})
router.delete("/del/:id",async(req,res) =>{
    let id = req.params.id
    id = parseInt(id)
    // await cart.deleteMany({
    //     where:{
    //         keyGames_keyId:id
    //     }
    // })
    // await keycategory.deleteMany({
    //     where:{
    //         keyGames_keyID:id
    //     }
    // })
    let result = await keygames.deleteMany({
        where:{
            keyId:id
        }
    })
    if(result.count==0){
        return res.send("Delete faild please check your keygames id")
    }
    return res.send("Delete success ")
})


module.exports = router