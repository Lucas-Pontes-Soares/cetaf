import { useNavigate } from 'react-router-dom';
import styles from '../css/login.module.css';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

function Login() {
  const [isAlunoChecked, setIsAlunoChecked] = useState(false);
  const [isProfessorChecked, setIsProfessorChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigateTo = useNavigate();
  
  async function login(e) {
    e.preventDefault(); 

    try {
      const response = await axios.post(`http://localhost:3076/api/login`,
        {
          type: isAlunoChecked ? '1' : '2',
          email: email,
          password: password
        }
      );
      if (response.data.success === true) {
        toast.success("Login realizado com sucesso");
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("userType", isAlunoChecked ? '1' : '2');

        if(isAlunoChecked) {
          navigateTo('/StudentPage');
        } else if (isProfessorChecked){
          const responseTeacher = await axios.post(`http://localhost:3076/api/getCourseByTeacher`,
            {
              teacherId: response.data.userId,
            }
          );

          if(responseTeacher.data.success === true) {
            navigateTo('/TeacherPage');
          } else {
            navigateTo('/CreateCourse');
          }
        }
      } else {
        toast.error("Email ou senha inválidos");
      }
    } catch (error) {
      console.log("Erro ao fazer login");
      toast.error("Erro ao fazer login");
    }
  }

  const toggleCheckbox = (selected) => {
    if (selected === 'aluno') {
      setIsAlunoChecked(true);
      setIsProfessorChecked(false);
    } else if (selected === 'professor') {
      setIsAlunoChecked(false);
      setIsProfessorChecked(true);
    }
  };

  function navigateToRegister() {
    navigateTo('/register');
  }

  return (
    <div className={styles.containerLogin}>
      <div className={styles.header}>
        CETAF <span>&#123; Ourinhos &#125; </span>
      </div>

      <div className={styles.login_container}>
        <h2>Área de Login</h2>
        
        <form onSubmit={login}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required onChange={(e) => setEmail(e.target.value)}/>
          
          <label htmlFor="senha">Senha</label>
          <input type="password" id="senha" name="senha" required onChange={(e) => setPassword(e.target.value)}/>
          
          <label>
            <input 
              type="checkbox" 
              id="aluno" 
              checked={isAlunoChecked} 
              onChange={() => toggleCheckbox('aluno')} 
            /> Entrar como aluno
          </label>
          <label>
            <input 
              type="checkbox" 
              id="professor" 
              checked={isProfessorChecked} 
              onChange={() => toggleCheckbox('professor')} 
            /> Entrar como professor
          </label>
          
          <button type="submit" className={styles.btn}>ENTRAR</button>
          <p>Ainda não tem conta? <a className={styles.link} onClick={navigateToRegister}>Cadastrar</a>.</p>
        </form>
      </div>

      <div className={styles.footer}>
        Todos os direitos reservados ao Centro de Ensino Tecnológico Agregado à Faculdade (CETAF) 2024.
      </div>

      <img className={styles.flag} src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/1024px-Flag_of_Brazil.svg.png" width="30" alt="Brazilian flag" />
    </div>
  );
}

export default Login;
