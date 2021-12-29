const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')

router.post('/', orderController.create)
router.post('/getorders', orderController.getOrders)
router.get('/webhook', orderController.webhook)

module.exports = router
