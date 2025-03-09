const express = require('express')
const getTemp = require('../controllers/tempController')
const router = express.Router()

router.get('/', getTemp)

module.exports = router;