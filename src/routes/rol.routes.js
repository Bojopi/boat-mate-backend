const { Router } = require('express');
const { getAllRoles, getRole } = require('../controllers/rol.controller')

const router = Router();

router.get('/role', getAllRoles)

router.get('/role/10', getRole)

module.exports = router;