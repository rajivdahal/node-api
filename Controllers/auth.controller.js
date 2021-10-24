const express = require('express');
const router = express.Router();
const UserModel=require('./../models/user.model')
const map_user_req=require('./../helpers/map_user_request')
const upload = require('./../middlewares/uploader')('image');
const passwordHash=require("password-hash")
const configs=require("./../configs/db.configs")
const jwt=require('jsonwebtoken')


function generateToken(data){
    return jwt.sign({
        _id: data._id,
        username: data.username,
        role: data.role
    },configs.JWT_SECRET)  
}

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
                    
                    if(!result){
                        return next({
                            msg:"invalid username",
                            status:400
                        })
                    }
                    //validate password
                    const isMatched=passwordHash.verify(req.body.password,result.password)
                    if(!isMatched){
                        return next({
                            msg:"invalid password, login failed",
                            status:400
                        })
                    }
                    //end of validate password

                    if(result.status=="inactive"){
                        console.log("inside the if statement")
                        return next({
                            msg:"inaactive user",
                            status:400
                        })
                    }

                    //everything is perfect generate token
                    let token=generateToken(result)
                    //end of generating token

                    res.json({
                        user:result,
                        token:token
                    })
                })
                .catch(function(err){
                    next(err)
                })
})
router.post('/register',upload.single('image'),function(req,res,next){ //upload.single('image') ->image is thr fieldname of the  file
    console.log("at register page")
    console.log("request body is",req.body)
    console.log("request.file>>",req.file)
    if(req.fileTypeErr){
        return next({
            msg:"invalid file format",
            status:406
        })
    }
    if(req.file){
        req.body.image=req.file.filename
    }
    const newUser = new UserModel({}); 
    const mapped_user=map_user_req(req.body,newUser)
    mapped_user.password=passwordHash.generate(req.body.password)

    mapped_user.save(function(err,user){
        if(err){
            return next(err)
        }
        res.status(200)
        res.send(user)
    })
})

router.put('/:id',upload.single("image"),function(req,res,next){
    console.log("request body>>",req.body)
    console.log("request file,",req.file)
    if(req.fileTypeErr){
        return next({
            msg:"invalid file format",
            status:406
        })
    }
    if(req.file){
        req.body.image=req.file.filename
    }
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