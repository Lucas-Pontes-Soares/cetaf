import { useState } from 'react';
import styles from '../css/register.module.css';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import axios from 'axios';
import { toast } from 'sonner';

function Register() {
  const [isAlunoChecked, setIsAlunoChecked] = useState(false);
  const [isProfessorChecked, setIsProfessorChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const navigateTo = useNavigate();

  async function register(e) {
    e.preventDefault(); 

    try {
      if(isAlunoChecked){
        const response = await axios.post(`http://localhost:3076/api/createStudent`,
          {
            name: name,
            email: email,
            password: password,
            dateBirth: date
          }
        );
        if (response.data.success === true) {
          toast.success("Cadastro realizado com sucesso");
          
        } else {
          toast.error("Email já cadastrado");
        }
      } else if (isProfessorChecked){
        const response = await axios.post(`http://localhost:3076/api/createTeacher`,
          {
            name: name,
            email: email,
            password: password,
            dateBirth: date,
            idPhoto: 1
          }
        );
        if (response.data.success === true) {
          toast.success("Cadastro realizado com sucesso");
          
        } else {
          toast.error("Email já cadastrado");
        }
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

  async function navigateToLogin(){
    navigateTo('/login');
  }
  
  return (
    <div className={styles.containerLogin}>
      <div className={styles.header}>
        CETAF <span>&#123; Ourinhos &#125; </span>
      </div>

      <div className={styles.login_container}>
        <h2>Área de Cadastro</h2>
        <form onSubmit={register}>
          <label htmlFor="nome">Nome Completo</label>
          <input type="text" id="nome" name="nome" required onChange={(e) => setName(e.target.value)}/>

          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required onChange={(e) => setEmail(e.target.value)}/>

          <label htmlFor="data-nascimento">Data de Nascimento</label>
          <input type="date" id="data-nascimento" name="data-nascimento" required onChange={(e) => setDate(e.target.value)}/>

          <label htmlFor="senha">Senha</label>
          <input type="password" id="senha" name="senha" required onChange={(e) => setPassword(e.target.value)}/>

          <div className={styles.roles}>
            <label>
              <input 
                type="checkbox" 
                id="aluno" 
                checked={isAlunoChecked} 
                onChange={() => toggleCheckbox('aluno')} /> Cadastrar como aluno
            </label>
            <label>
              <input 
                type="checkbox" 
                id="professor" 
                checked={isProfessorChecked} 
                onChange={() => toggleCheckbox('professor')} /> Cadastrar como professor
            </label>
          </div>

          <button type="submit" className={styles.btn}>CADASTRAR</button>
          <p>Já possui uma conta? <a onClick={() => navigateToLogin()}>Entrar</a>.</p>
        </form>
      </div>

      <div className={styles.footer}>
        Todos os direitos reservados ao Centro de Ensino Tecnológico Agregado à Faculdade (CETAF) 2024.
      </div>

      <img className={styles.flag} src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/1024px-Flag_of_Brazil.svg.png" width="30" alt="Brazilian flag" />
    </div>
  );
}

export default Register;
