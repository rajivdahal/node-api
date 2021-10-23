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
        newproduct.images = typeof (data.images) === "string" ?
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

}
function map_review(data, new_review) {
    if (data.user)
        new_review.user = data.user
    if (data.reviewPoint)
        new_review.point = data.reviewPoint
    if (data.reviewMessage)
        new_review.message = data.reviewMessage;

}
function find(condition) {
    return new Promise(function (resolve, reject) {
        productmodel.find(condition, function (err, done) {
            if (err) {
                console.log("error in fetching the data")
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
            map_product(data.data, done)

            //extra portion for file update
            if (data.data.images) {
                done.images = done.images.concat(data.data.images)
            }
            //end of extra portion for file upload
            console.log("data.data is>>", data.data)
            console.log(done)
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