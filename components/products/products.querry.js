const productmodel = require('./products.model')
function map_product(data, newproduct) {
    if (data.name)
        newproduct.name = data.name
    if (data.category)
        newproduct.category = data.category
    if (data.description)
        newproduct.description = data.description
    if (data.quantity)
        newproduct.quantity = data.quantity
    if (data.modelNo)
        newproduct.modelNo = data.modelNo
    if (data.price)
        newproduct.price = data.price
    if (data.images)
        newproduct.images = typeof (data.images) === "string" ? //in most of the cases data.images will only coome this logic will fail
        //array will come most of the time not string
            data.images.split(',') :
            data.images
            
    if (data.sku)
        newproduct.sku = data.sku
    if (data.stock_quantity)
        newproduct.stock_quantity = data.stock_quantity
    if (!newproduct.discount)
        newproduct.discount = {}
    if (data.discountedItem)
        newproduct.discount.discountedItem = true
    if (data.isdiscountedItemFalse)
        newproduct.discount.discountedItem = false
    if (data.discountType)
        newproduct.discount.discountType = data.discountType
    if (data.discountValue)
        newproduct.discount.discountValue = data.discountValue
    if (data.status)
        newproduct.status = data.status
    if (data.manuDate)
        newproduct.manuDate = data.manuDate
    if (data.expiryDate)
        newproduct.expiryDate = data.expiryDate
    if (data.purchasedDate)
        newproduct.purchasedDate = data.purchasedDate
    if (data.salesDate)
        newproduct.salesDate = data.salesDate
    if (data.isUsed)
        newproduct.isUsed = true
    if (data.notUsed)
        newproduct.isUsed = false
    if (data.isReturnEligible)
        newproduct.isReturnEligible = true
    if (data.isReturnEligibleFalse)
        newproduct.isReturnEligible = false
    if (data.warrentyStatus)
        newproduct.warrentyStatus = true
    if (data.warrentyStatusFalse)
        newproduct.warrentyStatus = false
    if (data.warrentyPeriod)
        newproduct.warrentyPeriod = data.warrentyPeriod
    if (data.origin)
        newproduct.origin = data.origin
    if (data.tags)
        newproduct.tags = typeof (data.tags) === "string" ? data.tags.split(',') : data.tags
    if (data.offers)
        newproduct.offers = typeof (data.offers) === "string" ? data.offers.split(',') : data.offers
    if (data.orderNumber)
        newproduct.orderNumber = data.orderNumber
    if(data.vendor)
        newproduct.vendor=data.vendor    

}
function map_review(data, new_review) {
    if (data.user)
        new_review.user = data.user
    if (data.reviewPoint)
        new_review.point = data.reviewPoint
    if (data.reviewMessage)
        new_review.message = data.reviewMessage;

}

//start of exec logic
//simple format is: 
// productmodel.find({condition},function(err,done{

// }))

// to
// productmodel.find({condition},exec(function(err,done){

// }))

function find(condition) {

    return new Promise(function (resolve, reject) {
        productmodel.find(condition)
                    .sort({
                        _id:-1
                    })
                    .populate('vendor',{ 
                        username:1,
                        email:1
                    })
                    .populate('reviews.user',{
                        username:1,
                        email:1
                    })
                    .exec(function(err,done){
                        if(err){
                            return reject(err)
                        }
                        resolve(done)
                    })
    })
}

function insert(data) {
    return new Promise(function (resolve, reject) {
        const newproduct = new productmodel
        map_product(data, newproduct)
        newproduct.save(function (err, done) {
            if (err) {
                return reject(err)
            }
            resolve(done)
        })
    })
}
function remove(data) {
    return new Promise(function (resolve, reject) {
        productmodel.findByIdAndRemove(data._id, function (err, done) {
            if (err) {
                return reject(err)
            }
            if (!done) {
                return reject({
                    msg: "product not  found",
                    status: 404
                })
            }
            resolve(done)
        })
    })
}
function update(data) {
    return new Promise(function (resolve, reject) {
        productmodel.findById(data.id, function (err, done) {

            if (err) {
                return reject(err)
            }
            if (!done) {
                return reject("product not found")
            }
            map_product(data.data, done) //data.data contains images field and whenever images field are sent to a mapper mapper replaces
            //the old image name and keep the recent nemes obtainied from the update product controller, this causes an error
            // coz you need to append new images to the old images but old images are replace so you need to fix the issue
            //upto this point new images are stored in a done andd extra logic needs to be applied

            //extra portion for file update
            if (data.data.newimages) {
                done.images = done.images.concat(data.data.newimages) //its an array concatination done.images is also array and data.data.images is also array and 
                //final result is an array
            }
            //end of extra portion for file upload
            //from controller string data to files to remove are processed and given as array to querry, here the querry is processed 
            //and extracted only the image name 
            
            //if the name of image matches with imagettoremove delete them from product and save the product first check if filestoremove are there or not
            if(data.data.filesToRemove && data.data.filesToRemove.length){
                done.images.forEach(function(item,index){
                    if(data.data.filesToRemove.includes(item)){
                        done.images.splice(index,1)
                    }
                })
            }
            
            
            done.save(function (err, done) {
                if (err) {
                    return reject(err)
                }
                resolve(done)
            })

        })
    })
}
function addReview(id, data) {
    return new Promise(function (resolve, reject) {
        productmodel.findById(id, function (err, done) {
            if (err) {
                return reject(err)
            }
            if (!done) {
                return reject({
                    msg: "product not found",
                    status: 44
                })

            }
            const new_review = {}
            map_review(data, new_review)
            done.reviews.push(new_review)
            done.save(function (err, done) {
                if (err) {
                    console.log("from inside the mfas")
                    return reject(err)
                }
                resolve(done)
            })
        })
    })
}
module.exports = {
    find,
    insert,
    remove,
    update,
    addReview
}