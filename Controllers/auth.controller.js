const express = require('express');
const router = express.Router();
const UserModel = require('./../models/user.model')
const map_user_req = require('./../helpers/map_user_request')
const upload = require('./../middlewares/uploader')('image');
const passwordHash = require("password-hash")
const configs = require("./../configs/db.configs")
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
const randomString=require("randomstring")

const sender = nodemailer.createTransport(smtpTransport({
    service: 'Gmail',
    auth: {
        user: "rajivdahal2@gmail.com",
        pass: "fuckinggmail123"
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    },
}))
function prepareEmail(data) {
    return {
        from: 'Group 37 Store<noreply@example.com>', // sender address
        to: data.email, // list of receivers
        subject: "Forgot Password ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `
        <p>Hi <strong>${data.name}</strong>,</p>
        <p>we noticed that you are having trouble logging into our system please click the link below to reset your password</p>
        <p><a href="${data.link}" target="_blank">click here to reset password</a></p>
        <p>Regards</p>
        <p>Group37 Support Team</p>
        <p>2021</p>`

    }
}

function generateToken(data) {
    return jwt.sign({
        _id: data._id,
        username: data.username,
        role: data.role
    }, configs.JWT_SECRET)
}

router.get('/', function (req, res, next) {
   require('fs').readFile('skdfabsfkas',function(err,done){
       if(err){
           return req.myev.emit('err',err,res)
       }

   })
})

router.post('/login', function (req, res, next) {
    console.log(req.body)
    UserModel.findOne({ 
        $or:[
            {username: req.body.username },
            {email:req.body.username}
        ]
        

    })
        .then(function (result) {

            if (!result) {
                return next({
                    msg: "invalid username",
                    status: 400
                })
            }
            //validate password
            const isMatched = passwordHash.verify(req.body.password, result.password)
            if (!isMatched) {
                return next({
                    msg: "invalid password, login failed",
                    status: 400
                })
            }
            //end of validate password

            if (result.status == "inactive") {
                console.log("inside the if statement")
                return next({
                    msg: "inaactive user",
                    status: 400
                })
            }

            //everything is perfect generate token
            let token = generateToken(result)
            //end of generating token

            res.json({
                user: result,
                token: token
            })
        })
        .catch(function (err) {
            next(err)
        })
})
router.post('/register', upload.single('image'), function (req, res, next) { //upload.single('image') ->image is thr fieldname of the  file
    console.log("at register page")
    console.log("request body is", req.body)
    console.log("request.file>>", req.file)
    if (req.fileTypeErr) {
        return next({
            msg: "invalid file format",
            status: 406
        })
    }
    if (req.file) {
        req.body.image = req.file.filename
    }
    const newUser = new UserModel({});
    const mapped_user = map_user_req(req.body, newUser)
    mapped_user.password = passwordHash.generate(req.body.password)

    mapped_user.save(function (err, user) {
        if (err) {
            return next(err)
        }
        res.status(200)
        res.send(user)
    })
})

router.put('/:id', upload.single("image"), function (req, res, next) {
    console.log("request body>>", req.body)
    console.log("request file,", req.file)
    if (req.fileTypeErr) {
        return next({
            msg: "invalid file format",
            status: 406
        })
    }
    if (req.file) {
        req.body.image = req.file.filename
    }
    UserModel.findOne({ _id: req.params.id }, function (err, user) {
        if (err) {
            return next(err)
        }
        if (!user) {
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
        const mapped_user = map_user_req(req.body, user)
        mapped_user.save(function (err, done) {
            if (err) {
                return next(err)
            }
            res.json({
                msg: "data successfully modified",
                user: done
            })
        })
    })
})
router.get('/about', function (req, res, next) {
    res.json({
        msg: "from auth aboutpage",
        status: 200
    })
})

router.post('/forgot-password', function (req, res, next) {
    UserModel.findOne({
        email: req.body.email
    }, function (err, user) {
        if (!user) {
            return next({
                msg: "email not registered yet",
                status: 400
            })

        }
        if (err) {
            console.log("inside first err request")
            return next(err)
        }
        var randomtoken=randomString.generate(23)
        var tokenExpiry = Date.now() + 1000 * 60 * 60 * 2; 
        
        var emaildata = {
            name: user.username,
            email: user.email,
            link: `${ req.headers.origin }/reset_password/${randomtoken}`
        }
        var emailBody = prepareEmail(emaildata)
        user.passwordResetToken=randomtoken
        user.passwordResetTokenExpiry =tokenExpiry
        user.save(function(err,done){
            if(err){
                return next(err)
            }
            sender.sendMail(emailBody, function (err, done) {
                if (err) {
                console.log("inside second err request")
    
                    return next(err)
                }
                res.json(done)
    
            })
            console.log("the user is",done)
        })
       
    })

})
router.post('/reset-password/:token',function(req,res,next){
     UserModel.findOne({
         passwordResetToken:req.params.token,
         passwordResetTokenExpiry: {
            $gte: Date.now()
        }
     })
     .then(user=>{
         if(!user){
             return next({
                 msg:"user not found,Invalid or expired password reset token",
                 status:400
             })
         }
         user.password=passwordHash.generate(req.body.password)
         user.passwordResetTokenExpiry = null;
         user.passwordResetToken = null;
         user.save(function(err,done){
             if(err){
                 return next(err)
             }
             res.json(done)
         })
     })
     .catch(err=>{
         next(err)
     })
})

module.exports = router