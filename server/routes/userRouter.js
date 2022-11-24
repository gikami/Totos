const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration)
router.post('/newpassword', userController.newPassword)
router.post('/login', userController.login)
router.post('/address', authMiddleware, userController.addAddress)
router.post('/editaddress', authMiddleware, userController.editAddress)
router.post('/deleteaddress', authMiddleware, userController.deleteAddress)
router.post('/edit', authMiddleware, userController.edit)
router.get('/auth', authMiddleware, userController.check)
router.post('/updatePoint', authMiddleware, userController.updatePoint)

module.exports = router
