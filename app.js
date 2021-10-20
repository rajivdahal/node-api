const express=require("express")

const PORT=4000;
const app=express()
const authrouter=require('./Controllers/auth.controller')
const userrouter=require('./Controllers/user.controller')
const path = require('path')
const authenticate=require('./middlewares/authentication')
const isadmin=require('./middlewares/isadmin')


require('./db_init')

// console.log("path is",process.cwd())
// console.log("current working directory is",__dirname)
app.use(express.urlencoded({
    extended:true
}))
app.use('/file', express.static(path.join(process.cwd(), 'uploads')))
app.use('/auth',authrouter)
app.use('/user',userrouter)


//start of error handling middlewares
app.use(function(req,res,next){
    next({
        msg:"endpoint not found",
        status:404
    })
})
app.use(function(err, req, res, next){
    res.json({
        msg:"from error handling middleware",
        msg2:"it is called when next is called with some argument from another middleware and has 4 parameters and dowsnt depend o order ",
        msg3:err

    })
})
//end of error handling middlewares



app.listen(PORT,function(err,done){
    if(err){
        return console.log("error in listening>>",PORT)
    }
    console.log("server listening at port>",PORT)
    console.log("precc CTRL+C to exit")
})