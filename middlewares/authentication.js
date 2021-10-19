const authorize=function(req,res,next){
    if(req.query.token==null){
        return next("please provide token")
    }
    if(req.query.token=="random"){
        return next()
    }
    next("invalid token")
}
module.exports=authorize