const express = require('express');
const routes = express.Router();
const { getCoursesWithStudents,
  createCourse, listCourse,
  updateCourse, deleteCourse,
  readCourseById } =
  require('../controllers/courseController');
const upload = require('../middleware/uploadMiddlware');


routes.post('/course', upload.single('thumbnail'), createCourse);
routes.get('/course/with-students', getCoursesWithStudents);
routes.get('/course/list', listCourse);
routes.put('/course/update/:id', upload.single('thumbnail'), updateCourse);
routes.delete('/course/delete/:id', deleteCourse);
routes.get('/course/read/:id', readCourseById);






module.exports = routes;
