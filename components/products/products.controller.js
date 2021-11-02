const productquery = require('./products.querry')
const jwt = require('jsonwebtoken')



function get(req, res, next) {
    let condition = {}
    if (req.user.role !== 1) {
        condition.vendor = req.user._id
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
        //req.files is files is plural because multiple data are there and it is always array of objects
        data.images = req.files.map(function (item) { //appending the items from object to make array output from here is [ '1635005677910-next.jpg', '1635005677912-photo.png' ]
            return item.filename
        })
    }
    //end of file upload
    data.vendor = req.user._id

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
    console.log("inside update")
    const incdata = {
        id: req.params.id,
        data: req.body //data will be object coz it is req.body
    }
    //extra logic for file upload update
    if (req.files && req.files.length) { //req.files will be array of objects 
        incdata.data.newimages = req.files.map(function (item) {
            return item.filename  //it will map all the filename and store in incdata->data->images as  [ '1635005677910-next.jpg', '1635005677912-photo.png' ]
        })
    }
    //end of extra logic for file upload update

    // from the react layer whenever the existing images that are shown in react UI needs to be removed then such images are 
    // send to server through filestoremove that are append to request.body and by further processing it has come to incdata.data.filestoremove
    //those images that are present in filestoremove needs to be deleted from database 
    //they are in URL form as   
    //filesToRemove: 'http://localhost:4000/file/images/1635764233865-hello.jpg,http://localhost:4000/file/images/1635764492159-next.jpg,http://localhost:4000/file/images/1635764492159-photo.png'

    // console.log(incdata.data.filesToRemove)
    // console.log("type of filestoremove is>>>",typeof(incdata.data.filesToRemove)) type is string 
    //before saving the data you need to process those string one by one and extract only image name and put them in array format
    if (incdata.data.filesToRemove && incdata.data.filesToRemove.length) {
        let filestoremove = incdata.data.filesToRemove.split(',')
        filestoremove = filestoremove.map(function (item) {
            return item.split('images/')[1]
        })
        incdata.data.filesToRemove = filestoremove
    }

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
    data.user = req.user._id //data.user is from the authentication i.e after authentication req.user has object,id,username and role
    productquery.addReview(req.params.id, data)
        .then(function (response) {
            res.send(response)
        })
        .catch(function (err) {
            next(err)
        })
}
function search(req, res, next) {
    let condition = {}
    const data = req.method === "GET" ? req.query : req.body
    if (data.category)
        condition.category = data.category
    if (data.name)
        condition.name = data.name
    if (data.color)
        condition.color = data.color
    if (data.minPrice)
        condition.price = {
            $gte: data.minPrice
        }
    if (data.maxPrice)
        condition.price = {
            $lte: data.maxPrice
        }
    if (data.minPrice && data.maxPrice)
        condition.price = {
            $lte: data.maxPrice,
            $gte: data.minPrice
        }
    if (data.fromDate && data.toDate) {
        const fromDate = new Date(data.fromDate).setHours(0, 0, 0, 0);
        const toDate = new Date(data.toDate).setHours(23, 59, 59, 999);
        condition.createdAt = {
            $lte: new Date(toDate),
            $gte: new Date(fromDate)
        }
    }
    if (data.tags) {
        condition.tags = {
            $in: data.tags.split(',')
        }
    }

productquery.find(condition)
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
    addReview,
    search
}
