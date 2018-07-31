var mongoose = require('mongoose');
var enrollmentSchema = require('./enrollment.schema.server');
var enrollmentModel = mongoose.model(
  'EnrollmentModel',
  enrollmentSchema
);

function enrollStudentInSection(enrollment) {
  return enrollmentModel.create(enrollment);
}

function unenrollStudentFromSection(enrollment) {
    return enrollmentModel.findOneAndRemove(enrollment);
}

function findSectionsForStudent(studentId) {
  return enrollmentModel
    .find({student: studentId})
    .populate('section')
    .exec();
}

function deleteEnrollmentsForSection(section) {
    return enrollmentModel.remove({ section: section});
}

function deleteEnrollmentsForStudent(user) {
    return enrollmentModel.remove({ student: user});
}

module.exports = {
  enrollStudentInSection: enrollStudentInSection,
  findSectionsForStudent: findSectionsForStudent,
  unenrollStudentFromSection: unenrollStudentFromSection,
  deleteEnrollmentForSection: deleteEnrollmentsForSection,
  deleteEnrollmentsForStudent: deleteEnrollmentsForStudent
};