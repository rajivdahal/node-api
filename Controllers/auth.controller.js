const express = require('express');
const router = express.Router();
const UserModel=require('./../models/user.model')
const map_user_req=require('./../helpers/map_user_request')



router.get('/',function(req,res,next){
    res.json({
        msg:"from auth homepage",
        status:200
    })
})
router.post('/login',function(req,res,next){
    console.log(req.body)
      UserModel.findOne({username:req.body.username})
                .then(function(result){
                    if(result.status=="active"){
                        console.log("inside the if statement")
                        return next({
                            msg:"inaactive user",
                            status:400
                        })
                    }
                    res.send(result)
                })
                .catch(function(err){
                    next(err)
                })
})
router.post('/register',function(req,res,next){
    console.log("at register page")
    console.log("request body is",req.body)
    const newUser = new UserModel({});
    // newUser.name=req.body.name
    // newUser.email=req.body.email
    // newUser.username=req.body.username
    // newUser.password=req.body.password
    // newUser.phoneNumber=req.body.phoneNumber
    // newUser.address={}
    // newUser.address.permanentAddress=req.body.permanentAddress
    // newUser.address.temporaryAddress=req.body.temporaryAddress.split(",")
    // newUser.dob=req.body.dob

    //upper logic is maintained in seperate helpers ->map_user_request file and the funda is same 
    const mapped_user=map_user_req(req.body,newUser)
    console.log("request body is",req.body)
    mapped_user.save(function(err,user){
        if(err){
            return next(err)
        }
        res.status(200)
        res.send(user)
    })
})

router.put('/:id',function(req,res,next){
    UserModel.findOne({_id:req.params.id},function(err,user){
        if(err){
            return next(err)
        }
        if(!user){
            return next("user not found")
        }
        //in normal fashion

        // if(req.body.username)  
        //         user.username=req.body.username     
        // if(req.body.email)  
        //         user.email=req.body.email
        // if(req.body.name)  
        //         user.name=req.body.name       
        // if(req.body.password)  
        //         user.password=req.body.password   
        // if(req.body.phoneNumber)  
        //         user.phoneNumber=req.body.phoneNumber   

                
        // if(req.body.permanentAddress || req.body.temporaryAddress && !user.address)
        //         user.address={}
        // if(req.body.permanentAddress)  
        //         user.address.permanentAddress=req.body.permanentAddress   
        // if(req.body.temporaryAddress)  
        //         user.address.temporaryAddress=req.body.temporaryAddress.split(',')   
       

        // if(req.body.gender)  
        //         user.gender=req.body.gender   
        // if(req.body.dob)  
        //         user.dob=req.body.dob   
        // if(req.body.country)  
        //         user.country=req.body.country   
        // if(req.body.image)  
        //         user.image=req.body.image   
        // if(req.body.role)  
        //         user.role=req.body.role   
        // if(req.body.isArchived)  
        //         user.isArchived=true
        // if(req.body.setisArchivedFalse)  
        //         user.isArchived=false        
        // if(req.body.status)  
        //         user.status=req.body.status   
                
        // user.save(function(err,done){
        //     if(err){
        //         return next(err)
        //     }
        //     res.json({
        //         msg:"data successfully modified",
        //         user:done
        //     })
        // })   
        const mapped_user=map_user_req(req.body,user)     
        mapped_user.save(function(err,done){
            if(err){
                return next(err)
            }
            res.json({
                msg:"data successfully modified",
                user:done
            })
        })
    })
})
router.get('/about',function(req,res,next){
    res.json({
        msg:"from auth aboutpage",
        status:200
    })
})


module.exports=router