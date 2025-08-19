const express = require('express');
const routes = express.Router();
const {

  createStudent,
  getAllStudent,
  getStudentById,
  updateStudent,
  deleteStudent

 } = require('../controllers/studentController');

// Define a route for getting student information
routes.post('/student', createStudent );
routes.get('/student/list', getAllStudent);
routes.get('/student/read/:id', getStudentById);
routes.put('/student/update/:id',  updateStudent)
routes.delete('/student/delete/:id', deleteStudent)







module.exports = routes;
