module.exports = function (app) {

    app.post('/api/course/:courseId/section', createSection);
    app.get('/api/course/:courseId/section', findSectionsForCourse);
    app.post('/api/student/:sid/section/:kid', enrollStudentInSection);
    app.delete('/api/student/:sid/section/:kid', unenrollStudentFromSection);
    app.get('/api/student/:sid/section', findSectionsForStudent);
    app.get('/api/section/:sectionId', findSectionById);
    app.put('/api/section/:sectionId', updateSection);
    app.delete('/api/section/:sectionId', deleteSection);

    var sectionModel = require('../models/section/section.model.server');
    var enrollmentModel = require('../models/enrollment/enrollment.model.server');

    function findSectionById(req, res) {
        var sectionId = req.params['sectionId'];
        sectionModel
            .findSectionsForCourse(courseId)
            .then(function (sections) {
                res.json(sections);
            })
    }
    function findSectionsForStudent(req, res) {
        var currentUser = req.session.currentUser;
        var studentId = currentUser._id;
        enrollmentModel
            .findSectionsForStudent(studentId)
            .then(function (enrollments) {
                console.log(enrollments);
                res.json(enrollments);
            });
    }

    function enrollStudentInSection(req, res) {
        var sectionId = req.params.kid;
        var currentUser = req.session.currentUser;
        var studentId = currentUser._id;
        var enrollment = {
            student: studentId,
            section: sectionId
        };

        sectionModel
            .decrementSectionSeats(sectionId)
            .then(function () {
                return enrollmentModel
                    .enrollStudentInSection(enrollment)
            })
            .then(function (enrollment) {
                res.json(enrollment);
            })
    }

    function unenrollStudentFromSection(req, res) {
        var sectionId = req.params.kid;
        var currentUser = req.session.currentUser;
        var studentId = currentUser._id;
        var enrollment = {
            student: studentId,
            section: sectionId
        };

        sectionModel
            .incrementSectionSeats(sectionId)
            .then(function () {
                return enrollmentModel
                    .unenrollStudentFromSection(enrollment)
            })
            .then(function (enrollment) {
                res.json(enrollment);
            })
    }

    function findSectionsForCourse(req, res) {
        var courseId = req.params['courseId'];
        sectionModel
            .findSectionsForCourse(courseId)
            .then(function (sections) {
                res.json(sections);
            })
    }

    function createSection(req, res) {
        var section = req.body;
        sectionModel
            .createSection(section)
            .then(function (section) {
                res.json(section);
            })
    }

    function updateSection(req, res) {
      var section = req.body;
       var sectionId = req.params.sectionId;
        sectionModel
            .updateSection(sectionId, section)
            .then(function (section) {
                res.json(section);
            })
    }

    function deleteSection(req, res) {
        var sectionId = req.params.sectionId;
        enrollmentModel
            .deleteEnrollmentForSection(sectionId)
            .then(sectionModel
                .deleteSection(sectionId)
                .then(function (section) {
                    res.json(section);
                }))

    }
};