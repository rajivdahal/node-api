const productquery = require('./products.querry')
const jwt = require('jsonwebtoken')



function get(req, res, next) {
    const condition = {}
    if(req.user.role!==1){
        condition.vendor=req.user._id
    }
    productquery.find(condition)
        .then(function (response) {
            res.send(response)
        })
        .catch(function (err) {
            next(err)
        })
}
function post(req, res, next) {
    const data = req.body
    //start of file upload
    if (req.files && req.files.length) { //since the array of files are incoming data and it is always true for req.files in array so to become true req.files.length must be 1 or more
        data.images = req.files.map(function (item) { //appending the items from object to make array output from here is [ '1635005677910-next.jpg', '1635005677912-photo.png' ]
            return item.filename
        })
    }
    //end of file upload
    data.vendor=req.user._id

    productquery.insert(data)
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            next(err)
        })
}
function getByID(req, res, next) {
    productquery.find({ _id: req.params.id })
        .then(function (response) {
            res.send(response[0])
        })
        .catch(function (err) {
            res.send("dobas")
        })
}
function remove(req, res, next) {
    productquery.remove({ _id: req.params.id })
        .then(function (response) {
            res.send(response)
        })
        .catch(function (err) {
            next(err)
        })
}
function update(req, res, next) {
    const incdata = {
        id: req.params.id,
        data: req.body
    }
    //extra logic for file upload update
    if (req.files && req.files.length) {
        incdata.data.images = req.files.map(function (item) {
            return item.filename
        })
    }
    //end of extra logic for file upload update

    productquery.update(incdata)
        .then(function (response) {
            res.send(response)
        })
        .catch(function (err) {
            next(err)
        })
}
function addReview(req, res, next) {
    const data = req.body
    data.user=req.user._id //data.user is from the authentication i.e after authentication req.user has object,id,username and role
    productquery.addReview(req.params.id, data)
        .then(function (response) {
            res.send(response)
        })
        .catch(function (err) {
            next(err)
        })
}

module.exports = {
    get,
    post,
    getByID,
    remove,
    update,
    addReview
}
