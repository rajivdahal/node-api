const express=require('express')
const router=express.Router()

const authrouter=require('./../Controllers/auth.controller')
const userrouter=require('./../Controllers/user.controller')
const productrouter=require('./../components/products/products.route')


router.use('/auth',authrouter)
router.use('/user',userrouter)
router.use('/product',productrouter)
module.exports=router;