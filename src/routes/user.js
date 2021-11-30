const router = require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const fs = require("fs/promises")
const { PrismaClient } = require("@prisma/client")
const { response } = require("express")
const {user } = new PrismaClient()
const {userToken,adminToken} = require("../middlewares/authen")
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


router.put("/update/:id",userToken,async(req,res) =>{
    let id = req.params.id
    id = Number(id)
    let {password,email,fName,lName} = req.body
    if(!(password&&email&&fName&&lName)){
        return res.send("Can not find user id.  Please check your user id !")
    }
try {
    encryptedPassword = await bcrypt.hash(password, 10);

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
} catch (error) {
    return res.send("Can not find user!")
}
    
    return res.send("Update Successfully")
})

router.delete("/del/:id",adminToken,async(req,res) =>{
    let id = req.params.id
    id = Number(id)
   
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
        return res.status(400).send("Please compleate you input !")
    }
    const existUser = await user.findFirst({
        where: { userName : userName ,email: email  }
    })
    if (existUser) {
        return res.status(409).send("User is already exist !")
    }
    encryptedPassword = await bcrypt.hash(password, 10);
    await user.create({
        data: {
            userName: userName,
            password: encryptedPassword,
            email: email.toLowerCase(),
            fName: fName,
            lName:lName
        }
    })
    return res.send("Register Successfully")
})

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
            return res.status(401).send("There is a problem with your account, please contact admin.")
        }
         delete existUser.password 
    const token =jwt.sign(existUser, process.env.Token_Key,{expiresIn:"30m"})
       return res.header("access-token",token).send({ userId:existUser.userId,token: token})

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
    return res.status(200).send("Logout successfully")
})
module.exports = router