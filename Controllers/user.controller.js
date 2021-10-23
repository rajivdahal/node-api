const express = require('express');
const router = express.Router();
const userModel=require("./../models/user.model")
const upload=require('./../middlewares/uploader')('image')


router.get('/',function(req,res,next){
    userModel.find({})
    .exec(function(err,users){
        if(err){
            return next(err)
        }
        res.send(users)
    })

    
        // userModel.find({},{username:1},function(err,user){
        //     if(err){
        //         return next(err)
        //     }
        //     res.send(user)
        // })
        
})
router.get('/login',function(req,res,next){
    res.json({
        msg:"from user loginpage",
        status:200
    })
})
router.get('/about',function(req,res,next){
    res.json({
        msg:"from user aboutpage",
        status:200
    })
})
router.get('/:id',function(req,res,next){
    userModel.findById(req.params.id,function(err,done){
        if(err){
            return next(err)
        }
        if(!done){
            return next("user not found")
        }
        res.status(200)
        res.json(done)
    })
})
router.delete('/:id',function(req,res,next){
    userModel.findById(req.params.id,function(err,user){
        if(err){
            return next(err)
        }
        if(!user){
            return next({
                msg:"user not found",
                status:400
            })
        }
        user.remove(function(err,removed){
            if(err){
                return next("error in removing")
            }
            res.json(removed)
        })
    })
})

module.exports=router