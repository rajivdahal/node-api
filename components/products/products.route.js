const router = require('express').Router();
const productcontroller = require('./products.controller')
const upload = require('./../../middlewares/uploader')('image');
const authenticate=require('./../../middlewares/authentication')
router.route('/')
    .post(authenticate,upload.array("image"),productcontroller.post)
    .get(authenticate,productcontroller.get)

router.route('/addreview/:id')
    .post(authenticate,productcontroller.addReview)
// router.route('/search')
//     .get(productcontroller.search)
//     .post(productcontroller.search)
router.route('/:id')

    .get(authenticate,productcontroller.getByID)
    .put(authenticate,upload.array("image"),productcontroller.update)
    .delete(authenticate,productcontroller.remove)

module.exports = router


