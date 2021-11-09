const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const { keygames,cart,keycategory,gametags } = new PrismaClient()
const dayjs = require("dayjs")
const multer = require("multer")
const path = require("path")
const { request } = require("../../server")
const { update } = require("../model/model")

const storage = multer.diskStorage({
    destination: './public/storageImages',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    const mimetype = filetypes.test(file.mimetype)

    if (mimetype) {
        return cb(null, true);
    } else {
        cb('error: image only')

    }
}

const upload = multer({
    storage: storage,
    limits: { fieldSize: 500 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
})

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
router.get("/getbyid/:id", async (req, res) => {
    let id = req.params.id
    id = Number(id)
    let totalkeygames = await keygames.findMany({
        where:{
            keyId:id
        },
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

router.get("/getkeybyuserid/:id", async (req, res) => {
    let id = req.params.id
    id = Number(id)
    let totalkeygames = await keygames.findMany({
        where:{
            user_userId:id
        },
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
router.get("/getimage/:id",async(req,res)=>{
    let id = req.params.id
    id = Number(id)
    const result = await keygames.findFirst({
        where:{
            keyId:id
        }
    })
    console.log(result)
    let pathFile = path.join(__dirname, '../../public/storageImages/'+ result.images) 
    return res.status(200).sendFile(pathFile)
})

router.post("/addimage/:id",upload.any(),async(req,res)=>{
    let id = req.params.id
    id = Number(id)
    const file = req.files
    console.log(file)
   const result =  await keygames.update({
        data:{
            images:file[0].filename
        },
        where:{
            keyId:id
        }
        
    })
    return res.status(200).send("upload success")
})

router.put("/updateimage/:id",upload.any(),async(req,res)=>{
    let id = req.params.id
    id = Number(id)
    const file = req.files
    console.log(file)
    let findoldimg = await keygames.findFirst({
        where:{
            keyId:id
        },
        select:{
            images:true
        },
    })
    console.log(findoldimg)
    var fs = require('fs');
    let pathDelete = path.join(__dirname, '../../public/storageImages/'+findoldimg.images)
    fs.unlinkSync(pathDelete);
   const result =  await keygames.update({
        data:{
            images:file[0].filename
        },
        where:{
            keyId:id
        }
        
    })
    return res.status(200).send("update images success")
})



router.post("/add",async(req,res) =>{
    let {gameName,gameDetail,price,releaseDate,gamedeveloper_devId,Platform_pId,user_userId,gametags} = req.body
    if(!(gameName&&gameDetail&&price&&releaseDate&&gamedeveloper_devId&&Platform_pId&&user_userId)){
        return res.send("Please check youu data again!!")
    }
    releaseDate =  new Date(releaseDate)
    
    let keygameObject =  {gameName,gameDetail,price,releaseDate,gamedeveloper_devId,Platform_pId,user_userId}
    
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
    let {gameName,gameDetail,price,releaseDate,gameDeveloper_devId,Platform_pId} = req.body
    releaseDate =  new Date(releaseDate)
    let keygameObject =  {gameName,gameDetail,price,releaseDate,gameDeveloper_devId,Platform_pId}
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
    id = Number(id)
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