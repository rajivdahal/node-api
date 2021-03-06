const mongoose=require('mongoose')
const UserSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique: true,
        sparse:true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number
    },
    address: {
        permanentAddress: String,
        temporaryAddress: [String]
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'others']
    },
    dob: {
        type: Date
    },
    country: {
        type: String,
        default: 'nepal'
    },
    image: {
        type: String
    },
    role: {
        type: Number, // 1 for admin,2 for general user,3 visitors,
        default: 2
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'active'
    },
    passwordResetToken:String,
    passwordResetTokenExpiry: String


})
const UserModel=mongoose.model('users',UserSchema)
module.exports=UserModel