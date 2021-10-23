const router = require('express').Router();
const productcontroller = require('./products.controller')
const upload = require('./../../middlewares/uploader')('image');

router.route('/')
    .post(upload.array("image"),productcontroller.post)
    .get(productcontroller.get)

router.route('/addreview/:id')
    .post(productcontroller.addReview)
// router.route('/search')
//     .get(productcontroller.search)
//     .post(productcontroller.search)
router.route('/:id')
    .get(productcontroller.getByID)
    .put(upload.array("image"),productcontroller.update)
    .delete(productcontroller.remove)

module.exports = router


