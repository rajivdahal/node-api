const express=require("express")

const PORT=4000;
const app=express()

app.get("/",function(request,response){
    console.log("at homepage")
    response.send("at homepage")
})
app.get("/login",function(request,response){
    console.log("at login page")
    response.json({
        msg:"at login page",
        status:200,
        data:["hello","hii"]
    })
})
app.get("/help",function(request,response){
    console.log("at help page")
    response.send("at help page")
})
app.get("/write/:name/:extra",function(request,response){
    console.log("at write page")
    response.json({
        msg:"from dynamic handler",
        params:request.params,
        query:request.query
    })
})

app.listen(PORT,function(err,done){
    if(err){
        return console.log("error in listening>>",PORT)
    }
    console.log("server listening at port>",PORT)
    console.log("precc CTRL+C to exit")
})