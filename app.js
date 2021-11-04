const express = require('express')

const PORT=4000;
const app=express()
const path = require('path')
const routes=require('./routes/app.routes')
const cors=require('cors')
const events=require('events')
const myev=new events.EventEmitter()

require('./sockets')(app)
require('./db_init')

app.use(function(req,res,next){
    req.myev=myev
    next()
})
myev.on('err',function(err,resp){
    console.log("err from the event based system is",err)
    resp.json(err)
})

app.use(cors())

console.log("path is",path.join(process.cwd()))
// console.log("current working directory is",__dirname)
app.use(express.urlencoded({
    extended:true
}))

app.use(express.json())

app.use('/file', express.static(path.join(process.cwd(), 'uploads')))
app.use('/',routes)


//start of error handling middlewares
app.use(function(req,res,next){
    next({
        msg:"endpoint not found",
        status:404
    })
})
app.use(function(err, req, res, next){
    res.status(err.status || 400)
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