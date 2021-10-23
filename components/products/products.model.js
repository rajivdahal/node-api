const { Timestamp } = require("bson");
const mongoose =require("mongoose")
const Schema=mongoose.Schema; //you need to use this schema in different places so for product make a schema by making another object
const reviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, //the object_id is passed and it is of that type
        ref: 'user' // from user collection user is searched
    },
    point: {
        type: Number,
        min: 1,
        max: 5
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const productSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    description:String,
    quantity:Number,
    modelNo:String,
    price:Number,
    images:[String], //many images and many images have many names
    sku:Number,
    stock_quantity:Number,
    status:{
        type:String,
        enum:['available','out-of-stock','booked'],
        default:'available'
    },
    reviews: [reviewSchema], //array of reviews one product have many reviews
    manuDate: Date,
    expiryDate: Date,
    purchasedDate: Date,
    salesDate: Date,
    discount: {
        discountedItem: Boolean,
        discountType: {
            type: String,
            enum: ['percentage', 'quantity', 'value']
        },
        discountValue: String
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    isReturnEligible: Boolean,
    warrentyStatus: Boolean,
    warrentyPeriod: String,
    origin: String,
    tags: [String],
    offers: [String],
    orderNumber: Number
},{
    timestamps:true, 
})
module.exports=mongoose.model('product',productSchema)
