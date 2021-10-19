module.exports=function(req,res,next){
    if(req.query.admin==="true"){
        return next()
    }
    next("you are not admin, not accessed")
}