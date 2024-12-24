import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/teacher.module.css';
import axios from 'axios';
import { toast } from 'sonner';

function TeacherPage() {
  const [course, setCourse] = useState([]);
  const [students, setStudents] = useState([]);
  const navigateTo = useNavigate();

  async function getStudentsOnEnrollment() {
    try {
      const response = await axios.post(`http://localhost:3076/api/getStudentsOnEnrollment`,
        {
          teacherId: localStorage.getItem("userId")
        }
      );
      if (response.data.success === true) {
          const enrollments = response.data.students;
          console.log(enrollments);
          setStudents(enrollments);
      } else {
        console.log("Erro ao buscar alunos");
      }
    } catch (error) {
      console.log("Erro ao buscar alunos");
    }
  }

  async function getCourseByTeacher() {
    try {
      const response = await axios.post(`http://localhost:3076/api/getCourseByTeacher`,
        {
          teacherId: localStorage.getItem("userId")
        }
      );
      if (response.data.success === true) {
          const courses = response.data.course;
          console.log(courses);
          setCourse(courses);
      } else {
        console.log("Erro ao buscar cursos");
      }
    } catch (error) {
      console.log("Erro ao buscar curso");
    }
  }

  async function handleLoggout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");

    toast.success("Deslogado com sucesso");
    
    navigateTo('/login');
  }

  function calculateAge(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    if (month < birthDate.getMonth() || (month === birthDate.getMonth() && day < birthDate.getDate())) {
        age--;
    }

    return age;
}

  useEffect(() => {
    getCourseByTeacher();
    getStudentsOnEnrollment();
  }, []);

  return (
    <div className={styles.containerTeacher}>
        <div className={styles.header}>
            CETAF <span>&#123; Ourinhos &#125; </span>

            <button className={styles.logout_btn} onClick={() => handleLoggout()}>Deslogar</button>
        </div>

        <div className={styles.containerTeacherHeader}>
            <h1>Área do Professor</h1><p>&gt; curso</p>
        </div>

          <div className={styles.course_section}>

            <h3>CURSO LECIONADO &gt;</h3>

            {course?.map(course => {
              return (
                <div className={styles.course_enrolled} key={course.id}>
                  {course.teacherIdPhoto == 1 ? (
                      <img src="./Walter.png" alt="Foto do Professor" />
                    ) : course.teacherIdPhoto == 2 ? (
                      <img src="./saul.png" alt="Foto do Professor" />
                    ) : (
                      <img src="./teacher.png" alt="Foto do Professor" />
                    )}
                  <div className={styles.course_info}>
                    <h2>{course.courseName}</h2>
                    <p>Descrição: {course.description}</p>
                    <p><strong>Professor:</strong> {course.teacherName}</p>
                  </div>
                </div>
              );
            })}

            <h3>ALUNOS MATRICULADOS &gt;</h3>

            <div className={styles.table_container}>
            <table>
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Idade</th>
                    </tr>
                </thead>
                <tbody>
                  {students?.map(student => {
                    return (
                      <tr key={student.id}>
                        {student.idPhoto == 1 ? (
                          <td><img src="./jesse.png" alt="Foto do aluno" /></td>
                        ) : (
                          <td><img src="./student.png" alt="Foto do aluno" /></td>
                        )}
                        <td>{student.id}</td>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{calculateAge(student.birthDate)}</td>
                      </tr>
                      
                    )
                  })}
                </tbody>
            </table>
            </div>
          </div>

        <div className={styles.footer}>
        Todos os direitos reservados ao Centro de Ensino Tecnológico Agregado à Faculdade (CETAF) 2024.
      </div>

      <img className={styles.flag} src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/1024px-Flag_of_Brazil.svg.png" width="30" alt="Brazilian flag" />
    </div>
  );
}

export default TeacherPage;
