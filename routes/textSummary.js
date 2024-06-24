const {Router} = require('express')
const router = Router();
const summaryController = require('../controllers/summaryController')


router.post('/getSummary',summaryController.getSummary);

module.exports = router;