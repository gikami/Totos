const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')

router.post('/', orderController.create)
router.post('/getorders', orderController.getOrders)
router.post('/promo', orderController.promo)
router.post('/webhook', orderController.webhook)
router.get('/getStreets', orderController.getStreets)

module.exports = router
