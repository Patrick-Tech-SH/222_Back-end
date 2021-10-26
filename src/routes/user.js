const router = require("express").Router()
// const  user  = require("../model/model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const fs = require("fs/promises")
const { PrismaClient } = require("@prisma/client")
const { response } = require("express")
const {user } = new PrismaClient()
const {userToken} = require("../middlewares/authen")
const  logout  = require('../model/model');




router.get("/",userToken, async (req, res) => {
    let totaluser = await user.findMany({
        include: {
            cart:true
        }
    })

     return res.send({ data:totaluser })

})

router.get("/profile",userToken, async(req,res) => {
    res.send({user:req.user})
})

router.post("/add",async(req,res) =>{
    let {userName,password,email,fName,lName} = req.body
    if(!(userName&&password&&email&&fName&&lName)){
        return res.send("Please check youu data again!!")
    }
    
    let userObject =  {userName,password,email,fName,lName}
    
    let result = await user.createMany({
        data: userObject
    })
   
    return res.send("Add success ")
})

router.put("/update/:id",userToken,async(req,res) =>{
    let id = req.params.id
    id = Number(id)
    let {password,email,fName,lName} = req.body
    if(!(password&&email&&fName&&lName)){
        return res.send("Can not find user id.  Please check your user id !")
    }
    // let userObject =  {password,email,fName,lName}
    encryptedPassword = await bcrypt.hash(password, 10);
    // const hashPassword = await bcrypt.hash(password, encryptedPassword)
    await user.update({
        where:{
            userId:id
        },
        data: {
            password: encryptedPassword,
            email: email.toLowerCase(),
            fName: fName,
            lName:lName
        }
    })
    return res.send("successfully")
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

router.post('/register', async (req, res) => {
    const { userName, email, password, fName,lName } = req.body
    if (!(userName && email && password && fName && lName )) {
        return res.status(400).send("please compleate you input !")
    }
    const existUser = await user.findFirst({
        where: { userName : userName ,email: email  }
    })
    if (existUser) {
        return res.status(409).send("User is already exist !")
    }
    encryptedPassword = await bcrypt.hash(password, 10);
    // const hashPassword = await bcrypt.hash(password, encryptedPassword)
    await user.create({
        data: {
            userName: userName,
            password: encryptedPassword,
            email: email.toLowerCase(),
            fName: fName,
            lName:lName
        }
    })
    return res.send("successfully")
})


// router.post("/login",async(req,res) =>{
//     try {
//         const {email,password} = req.body;
//         if(!(email && password)){
//             res.status(400).send("please compleate all input !")
//         }
//         const existUser =  await user.findFirst({
//             where: { email: email  }
//         })

//         if(existUser && (await bcrypt.compare(password, existUser.password))){
//             const token = jwt.sign(
//                 {email},
//                 process.env.Token_Key,
//                 {
//                     expiresIn: "5m"
//                 }
//             )
//             existUser.token = token 

//         res.status(200).json(existUser)

//         }
//         res.status(400).send("Error")
        
//     } catch (error) {
//         console.log(error)
//     }
// })
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existUser = await user.findFirst({
            where: { email: email }
        })
        const validPassword =await bcrypt.compare(password,existUser.password)
        if (!(existUser && validPassword)) {
             return res.status(400).send("invalid email or password")
        }
        
        if(existUser.status == true){
            return res.status(401).send("User unauthorized")
        }
         delete existUser.password 
    const token =jwt.sign(existUser, process.env.Token_Key,{expiresIn:"30m"})
       return res.header("access-token",token).send({ token: token})

    } catch(error) {
        console.log(error)
     }
})
router.post('/logout',userToken,async(req,res) => {
    await logout.create({
        data:{
            token:req.token
        }
    })
    return res.status(200).send("logout successfully")
})
module.exports = router