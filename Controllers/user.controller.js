const express = require('express');
const router = express.Router();


router.get('/',function(req,res,next){
    res.json({
        msg:"from user homepage",
        status:200
    })
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


module.exports=router