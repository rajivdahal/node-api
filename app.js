const express=require("express")

const PORT=4000;
const app=express()
const authrouter=require('./Controllers/auth.controller')
const userrouter=require('./Controllers/user.controller')



app.use('/auth',authrouter)
app.use('/user',userrouter)

app.use(function(req,res,next){
    res.json({
        msg:"endpoint not found",
        status:404
    })
})

app.listen(PORT,function(err,done){
    if(err){
        return console.log("error in listening>>",PORT)
    }
    console.log("server listening at port>",PORT)
    console.log("precc CTRL+C to exit")
})