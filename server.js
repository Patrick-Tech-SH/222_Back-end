let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let mysql = require('mysql')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const cors = require('cors')

const keygames = require('./src/routes/keyGames')
const platform = require('./src/routes/platform')
const user = require('./src/routes/user')
const gamedeveloper = require('./src/routes/gameDeveloper')
const gametags = require('./src/routes/gameTags')
const keycatagory = require('./src/routes/keyCatagory')
const admin = require('./src/routes/admin')

app.use(cors({
    origin: process.env.ORIGIN,
    methods: ['GET','POST','PUT','DELETE','HEAD','OPTION']
}))

app.use(express.json())
app.use(express.urlencoded({ extended:true}));



//honepage route
app.get('/health',(req,res) =>{
    return res.send({
        error: false, 
        message:'Homepage is working'
        

    })
})
app.use('/keygames',keygames)
app.use('/platform',platform)
app.use('/user',user)
app.use('/gamedeveloper',gamedeveloper)
app.use('/gametags',gametags)
app.use('/admin', admin)
app.use('/keycatagory', keycatagory)



let port = 3000
app.listen(port, () =>{
    console.log(`Node App is running on port ${port}`)
})

module.exports = app;