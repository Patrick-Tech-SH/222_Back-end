let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let mysql = require('mysql')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const cors = require('cors')

const keygames = require('./routes/keyGames')
const platform = require('./routes/platform')
const user = require('./routes/user')
const gamedeveloper = require('./routes/gameDeveloper')
const gametags = require('./routes/gameTags')

app.use(express.json())
app.use(express.urlencoded({ extended:true}));



//honepage route
app.get('/',(req,res) =>{
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

app.use(cors({
    origin: process.env.ORIGIN,
    methods: ['GET','POST','PUT','DELETE','HEAD','OPTION']
}))

let port = 3000
app.listen(port, () =>{
    console.log(`Node App is running on port ${port}`)
})

module.exports = app;