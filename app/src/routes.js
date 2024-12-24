import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentPage from './pages/StudentPage';
import TeacherPage from './pages/TeacherPage';
import CreateCourse from './pages/CreateCourse';

function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/StudentPage" element={<StudentPage />} />
        <Route path="/TeacherPage" element={<TeacherPage />} />
        <Route path="/CreateCourse" element={<CreateCourse />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Routing;
