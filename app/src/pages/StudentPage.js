import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/student.module.css';
import axios from 'axios';
import { toast } from 'sonner';
import Swal from "sweetalert2";

function StudentPage() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourse, setEnrolledCourse] = useState([]);
  const [enrolledCourseId, setEnrolledCourseId] = useState(0);

  const navigateTo = useNavigate();

  async function getCourses(courseId) {
    try {
      const response = await axios.post(`http://localhost:3076/api/getCourses`,
        {}
      );
      if (response.data.success === true) {
          const courses = response.data.courses;

          const updatedCourses = courses.filter(course => course.id !== courseId);

          for (let i = 0; i < updatedCourses.length; i++) {
            const responseTeachers = await axios.post(`http://localhost:3076/api/getTeacher`,
              {
                teacherId: updatedCourses[i].teacherId
              }
            );
            updatedCourses[i].teacher = responseTeachers.data.teacher;
          }
          console.log(updatedCourses);
          setCourses(updatedCourses);
      } else {
        console.log("Erro ao buscar cursos");
      }
    } catch (error) {
      console.log("Erro ao fazer login");
      toast.error("Erro ao fazer login");
    }
  }

  async function getEnrolledCourse() {
    try {
      const response = await axios.post(`http://localhost:3076/api/getEnrolledCourse`,
        {
          studentId: localStorage.getItem("userId")
        }
      );
      if (response.data.success === true) {
          const coursesEnrollment = response.data.enrollments;

          for (let i = 0; i < coursesEnrollment.length; i++) {
            const responseTeachers = await axios.post(`http://localhost:3076/api/getTeacher`,
              {
                teacherId: coursesEnrollment[i].teacherId
              }
            );
            coursesEnrollment[i].teacher = responseTeachers.data.teacher;
          }
          console.log(coursesEnrollment);
          setEnrolledCourse(coursesEnrollment);
          setEnrolledCourseId(coursesEnrollment[0].id);
          if(coursesEnrollment) {
            getCourses(coursesEnrollment[0].id);
          } else {
            getCourses();
          }
      } else {
        getCourses();
        console.log("Nenhuma matricula");
      }
    } catch (error) {
      console.log("erro:", error);
    }
  }

  async function handleCreateEnrollment(idCourse, courseName){
    Swal.fire({
      title: "Confirmar matrícula",
      text: "Deseja realmente se matricular no curso de " + courseName + "?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, matricular",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`http://localhost:3076/api/createEnrollment`,
          {
            studentId: localStorage.getItem("userId"),
            courseId: idCourse
          }
        ).then(response => {
          if (response.data.success === true) {
            toast.success("Matrícula realizada com sucesso");
            getEnrolledCourse();
          } else {
            toast.error("Apenas 1 matrícula é permitida");
          }
        });
      }
    });
  }
  async function handleLoggout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");

    toast.success("Deslogado com sucesso");

    navigateTo('/login');
  }

  useEffect(() => {
    getEnrolledCourse();
  }, []);

  return (
    <div className={styles.containerStudent}>
        <div className={styles.header}>
            CETAF <span>&#123; Ourinhos &#125; </span>

            <button className={styles.logout_btn} onClick={() => handleLoggout()}>Deslogar</button>
        </div>

        <div className={styles.containerStudentHeader}>
            <h1>Área do Aluno</h1><p>&gt; cursos</p>
        </div>
        <div className={styles.course_section}>

            <h3>MÁTRICULA ATUAL &gt;</h3>

            {enrolledCourse.map(course => {
              return (
                <div className={styles.course_enrolled}>
                    {course.teacher[0].idPhoto == 1 ? (
                      <img src="./Walter.png" alt="Foto do Professor" />
                    ) : course.teacher[0].idPhoto == 2 ? (
                      <img src="./saul.png" alt="Foto do Professor" />
                    ) : course.teacher[0].idPhoto == 3 ? (
                      <img src="./mike.png" alt="Foto do Professor" />
                    ) : course.teacher[0].idPhoto == 4 ? (
                      <img src="./mike.png" alt="Foto do Professor" />
                    ) : course.teacher[0].idPhoto == 5 ? (
                      <img src="./gus.png" alt="Foto do Professor" />
                    ): (
                      <img src="./teacher.png" alt="Foto do Professor" />
                    )}
                    <div className={styles.course_info}>
                        <h2>Curso Matriculado: {course.name}</h2>
                        <p>Descrição: {course.description}</p>
                        <p><strong>Professor:</strong> {course.teacher[0].name}</p>
                    </div>
                </div>
              )
            })}

            {enrolledCourse.length === 0 ? (
                <div className={styles.course_enrolled}>
                  <h3>Nenhuma matrícula realizada</h3>
                </div>
              ) : null}

            <h3>OUTROS CURSOS &gt;</h3>

            <br />
            <div className={styles.course_list}>
              {courses.map(course => {
                return (
                  course.id != enrolledCourseId ? (
                    <div className={styles.course_item} key={course.id}>
                      {course.teacher[0].idPhoto == 1 ? (
                        <img src="./Walter.png" alt="Foto do Professor" />
                      ) : course.teacher[0].idPhoto == 2 ? (
                        <img src="./saul.png" alt="Foto do Professor" />
                      ) : course.teacher[0].idPhoto == 3 ? (
                        <img src="./mike.png" alt="Foto do Professor" />
                      ) : course.teacher[0].idPhoto == 4 ? (
                        <img src="./gus.png" alt="Foto do Professor" />
                      ) : (
                        <img src="./teacher.png" alt="Foto do Professor" />
                      )}
                      <div className={styles.course_info}>
                          <h4>{course.name}</h4>
                          <p>Descrição: {course.description}</p>
                          <p><strong>Professor:</strong> {course.teacher[0].name}</p>
                      </div>
                      <button className={styles.enroll_btn} onClick={() => handleCreateEnrollment(course.id, course.name)}>Matricular-se</button>
                    </div>
                  ) : null
                )
              })}

              {courses.length === 0 ? (
                <div className={styles.course_item}>
                  <h3>Nenhum curso disponível</h3>
                </div>
              ) : null}
            </div>
        </div>

        <div className={styles.footer}>
        Todos os direitos reservados ao Centro de Ensino Tecnológico Agregado à Faculdade (CETAF) 2024.
      </div>

      <img className={styles.flag} src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/1024px-Flag_of_Brazil.svg.png" width="30" alt="Brazilian flag" />
    </div>
  );
}

export default StudentPage;
