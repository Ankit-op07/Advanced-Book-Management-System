const {Router} = require('express')
const router = Router();
const authController = require('../controllers/auth')


router.post('/signup',authController.signup);
router.get('/login',authController.login);


module.exports = router;