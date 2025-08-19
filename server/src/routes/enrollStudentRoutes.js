const express = require('express');
const routes = express.Router();
const { enrollStudent,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment
} = require('../controllers/enrollStudentController');



routes.post('/enroll/create', enrollStudent);
routes.get('/enroll/list', getAllEnrollments);
routes.get('/enroll/read/:id', getEnrollmentById);
routes.put('/enroll/update/:id', updateEnrollment); 
routes.delete('/enroll/delete/:id',deleteEnrollment )





module.exports = routes;
