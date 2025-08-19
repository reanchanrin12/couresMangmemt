const express = require('express');
const routes = express.Router();
const {
  createInstructor,
  getAllInstructor,
  getByIdInstructor,
  updateInstructor,
  deleteInstructor
  


} = require('../controllers/instructorController');


routes.post('/create/instructor', createInstructor);
routes.get('/list/instructor', getAllInstructor);
routes.get('/read/instructor/:id', getByIdInstructor);
routes.put('/update/instructor/:id', updateInstructor);
routes.delete('/delete/instructor/:id', deleteInstructor);







module.exports = routes;
