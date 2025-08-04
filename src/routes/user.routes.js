const router = require('express').Router();
const userController = require('../controllers/user.controller');
const passportJWT = require('../middlewares/passportJWT')();


router.post('/profile', passportJWT.authenticate(), userController.me);


module.exports = router;