const express = require('express');
const router = express.Router();


router.get('/',function(req,res,next){
    res.json({
        msg:"from auth homepage",
        status:200
    })
})
router.get('/login',function(req,res,next){
    res.json({
        msg:"from auth loginpage",
        status:200
    })
})
router.get('/about',function(req,res,next){
    res.json({
        msg:"from auth aboutpage",
        status:200
    })
})


module.exports=router