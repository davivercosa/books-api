const express = require('express');
const router = express.Router();

// controllers import
const HomeController = require('../controllers/HomeController');
const UsersController = require('../controllers/UsersController');
const BooksController = require('../controllers/BooksController');

// middlewares
const Authentication = require('../middlewares/Authentication');

// index
router.get('/', HomeController.index);

// authentication
router.post('/auth', UsersController.authentication); // 2

// users
router.post('/user', UsersController.create); // 1

router.patch('/user', Authentication, UsersController.update); // 3
router.delete('/user', Authentication, UsersController.delete); // 3
router.post('/password-token', Authentication, UsersController.passwordToken); // 3
router.patch('/password', Authentication, UsersController.updatePassword); // 3

// books
router.post('/book', Authentication, BooksController.create); // 3
router.get('/books/:page', Authentication, BooksController.list);

module.exports = router;
