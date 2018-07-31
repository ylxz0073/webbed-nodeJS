var mongoose = require('mongoose');
var sectionSchema = require('./section.schema.server');
var sectionModel = mongoose.model('SectionModel', sectionSchema);

function createSection(section) {
  return sectionModel.create(section);
}

function updateSection(sectionId, section) {
    return sectionModel.findOneAndUpdate(
        {_id: sectionId},
        {$set: section},
        {new: true});
}

function findSectionsForCourse(courseId) {
  return sectionModel.find({courseId: courseId});
}

function findSectionById(sectionId) {
    return sectionModel.find({_id: sectionId});
}

function decrementSectionSeats(sectionId) {
  return sectionModel.update({
    _id: sectionId
  }, {
    $inc: {seats: -1}
  });
}

function incrementSectionSeats(sectionId) {
  return sectionModel.update({
    _id: sectionId
  }, {
    $inc: {seats: +1}
  });
}

function deleteSection(sectionId) {
  return sectionModel.remove({ _id: sectionId});
}

module.exports = {
  createSection: createSection,
  findSectionsForCourse: findSectionsForCourse,
  decrementSectionSeats: decrementSectionSeats,
  incrementSectionSeats: incrementSectionSeats,
  deleteSection: deleteSection,
  updateSection: updateSection,
    findSectionById: findSectionById,
};