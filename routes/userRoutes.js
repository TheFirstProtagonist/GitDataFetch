const express = require('express');
const UserSearchController = require('../controllers/UserSearchController.js');

const router = express.Router();
const userSearchController = new UserSearchController();

router.get('/', (req, res) => {
  res.render('index', { users: userSearchController.users, error: null });
});

router.post('/search', async (req, res) => {
  const { username } = req.body;

  try {
    const user = await userSearchController.searchUser(username);
    res.redirect('/');
  } catch (error) {
    res.render('index', { users: userSearchController.users, error: error.message });
  }
});

router.post('/delete', (req, res) => {
  const { userId } = req.body;

  userSearchController.deleteById(userId);

  res.redirect('/');
});

module.exports = router;