const express = require('express')
const getVersion = require('../controllers/versionController')
const router = express.Router()

router.get('/', getVersion)

module.exports = router;