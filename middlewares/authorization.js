
module.exports=function(req,res,next){
    if(req.user.role===1){
        next()
    }
    else{
        next({
            msg:"authorization failed,you don't have access",
            status:401
        })
    }
}