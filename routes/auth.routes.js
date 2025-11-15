const express = require('express');
const router = express.Router();
const {
  loginController,
  refreshTokenController
} = require('../controllers/auth.controller');

router.post('login', loginController);
router.post('/refresh', refreshTokenController);

module.exports = router;