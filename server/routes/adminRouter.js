const Router = require('express')
const router = new Router()
const orderController = require('../controllers/adminController')

//router.post('/', orderController.create)
router.get('/getaikocategory', orderController.getAikoCategory)
router.get('/getaikoproducts', orderController.getAikoProducts)
router.post('/sendaikoorder', orderController.sendAikoOrder)

module.exports = router
