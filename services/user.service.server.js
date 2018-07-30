module.exports = function (app) {
  app.get('/api/user', findAllUsers);
  app.get('/api/user/:userId', findUserById);
  app.put('/api/user/:userId', updateUser);
  app.post('/api/user', createUser);
  app.get('/api/profile', profile);
  app.post('/api/logout', logout);
  app.post('/api/login', login);

  var userModel = require('../models/user/user.model.server');
  const adminUsername = 'admin';
  const adminPassword = 'admin';

  function login(req, res) {
    var credentials = req.body;

    userModel
      .findUserByCredentials(credentials)
      .then(function(user) {
        if (user) {
            req.session['currentUser'] = user;
        }
        if (user.username === adminUsername) {
            user.admin = true;
        }
        res.json(user);
      })
  }

  function logout(req, res) {
    req.session.destroy();
    res.send(200);
  }

  function findUserById(req, res) {
    var id = req.params['_id'];
    userModel.findUserById(id)
        .then(function (user) {
          res.json(user);
        })
    }


  function updateUser(req, res) {
    var user = req.body;
    console.log(user);
    userModel.updateUser(user)
        .then(function (user) {
          delete user.password;
          res.json(user);
        })
  }

  function profile(req, res) {
    console.log(req.session['currentUser']);
      var id = req.session['currentUser']._id;
      userModel.findUserById(id)
          .then(function (user) {
              delete user.password;
              res.json(user);
          })
    // res.send(req.session['currentUser']);
  }

  function createUser(req, res) {
    var newUser = req.body;

    userModel.findUserByUsername(newUser.username)
        .then(function(user) {
            if (user) {
                // console.log(user);
                res.json(null);
            } else {
                userModel.createUser(newUser)
                    .then(function (user) {
                        req.session['currentUser'] = user;
                        // console.log(req.session['currentUser']);
                        res.send(user);
                    })
            }
        })
  }

  function findAllUsers(req, res) {
    userModel.findAllUsers()
      .then(function (users) {
        res.send(users);
      })
  }
}
