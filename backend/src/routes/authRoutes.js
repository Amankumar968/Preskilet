const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authValidator = require('../validators/authValidator');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/register', authValidator.register, authController.register);
router.post('/login', authValidator.login, authController.login);

router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
