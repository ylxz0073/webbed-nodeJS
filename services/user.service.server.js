module.exports = function (app) {
  app.get('/api/user', findAllUsers);
  app.get('/api/user/:userId', findUserById);
  app.put('/api/profile', updateUser);
  app.post('/api/register', createUser);
  app.get('/api/profile', profile);
  app.post('/api/logout', logout);
  app.post('/api/login', login);
  app.delete('/api/profile', deleteUser);

  var userModel = require('../models/user/user.model.server');
  var enrollmentModel = require('../models/enrollment/enrollment.model.server');
  var sectionModel = require('../models/section/section.model.server');
  const adminUsername = 'admin';
  const adminPassword = 'admin';

  function login(req, res) {
    var credentials = req.body;

    userModel
      .findUserByCredentials(credentials)
      .then(function(user) {
        if (user) {
            req.session['currentUser'] = user;
            if (user.username === adminUsername) {
                user.admin = true;
            }
            delete user.password;
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
    console.log("profile" + req.session['currentUser']);
      if (req.session['currentUser']) {
          var id = req.session['currentUser']._id;
          userModel.findUserById(id)
              .then(function (user) {
                  if (user.username === adminUsername) {
                      user.admin = true;
                  }
                  delete user.password;
                  res.json(user);
              })
      } else {
          res.json(null);
      }

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

  function deleteUser(req, res) {
    var currentUser = req.session['currentUser'];

    var userId = currentUser._id;

    enrollmentModel.findSectionsForStudent(userId)
        .then(function(sections){
            console.log("section: " + sections);
          sections.forEach( function(section) {
            sectionModel.incrementSectionSeats(section.section._id).then(function(section){console.log("###" + section)});
              });
    }).then(function() {
              return enrollmentModel.deleteEnrollmentsForStudent(currentUser);
          })
          .then(function() {
              return userModel.deleteUser(userId);
          })
          .then(function(response)
      {
          req.session.destroy();
          res.json(response);
      });
  }

  function findAllUsers(req, res) {
    userModel.findAllUsers()
      .then(function (users) {
        res.send(users);
      })
  }
}
