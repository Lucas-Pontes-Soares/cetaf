const express = require('express');
const CreateStudent = require('./controllers/CreateStudent.js');
const CreateTeacher = require('./controllers/CreateTeacher.js');
const CreateCourse = require('./controllers/CreateCourse.js');
const CreateEnrollment = require('./controllers/CreateEnrollment.js');
const Login = require('./controllers/Login.js');
const GetCourses = require('./controllers/GetCourses.js');
const GetStudentsOnEnrollment = require('./controllers/GetStudentsOnEnrollment.js');
const GetStudent = require('./controllers/GetStudent.js');
const GetTeacher = require('./controllers/GetTeacher.js');
const GetEnrolledCourse = require('./controllers/GetEnrolledCourse.js');
const GetCourseByTeacher = require('./controllers/GetCourseByTeacher.js');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Olá, mundo!');
});

router.post('/createStudent', CreateStudent);
router.post('/createTeacher', CreateTeacher);
router.post('/createCourse', CreateCourse);
router.post('/createEnrollment', CreateEnrollment);
router.post('/login', Login);

router.post('/getCourses', GetCourses);
router.post('/getStudentsOnEnrollment', GetStudentsOnEnrollment);
router.post('/getStudent', GetStudent);
router.post('/getTeacher', GetTeacher);
router.post('/getEnrolledCourse', GetEnrolledCourse);
router.post('/getCourseByTeacher', GetCourseByTeacher);

module.exports = router;
