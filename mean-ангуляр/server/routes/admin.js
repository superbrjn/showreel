const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/moderController');

/*
router.get('/admin', function (req, res) {
  res.render('admin/login');
});

router.get('/admin/register', function (req, res) {
  res.render('admin/register');
});
*/
router.post('/register', AdminController.register);

router.post('/login', passport.authenticate('local'), AdminController.login);

router.get('/admin/dashboard', isAdmin, AdminController.dash);

function isAdmin (req, res, next) {
  if (req.isAuthenticated() && req.user.email === 'admin@gmail.com') { // hardcoded email of creator
    console.log('cool you are an admin, carry on your way');
    next();
  } else {
    console.log('You are not an admin');
    res.redirect('/admin');
  }
}

module.exports = router;
