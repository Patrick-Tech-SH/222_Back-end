const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const { user } = new PrismaClient()

router.get("/", async (req, res) => {
    let totaluser = await user.findMany({
        include: {
            cart:true
        }
    })

     return res.send({ data:totaluser })

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

module.exports = router