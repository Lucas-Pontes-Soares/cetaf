import { useState } from 'react';
import styles from '../css/createCourse.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

function CreateCourse() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const navigateTo = useNavigate();

  async function registerCourse(e) {
    e.preventDefault(); 

    try {
        const response = await axios.post(`http://localhost:3076/api/createCourse`,
            {
              name: name,
              description: description,
              teacherId: localStorage.getItem("userId")
            }
          );
        if (response.data.success === true) {
            toast.success("Curso cadastrado com sucesso");
            navigateTo('/TeacherPage');
        } else {
            toast.error("Você já possui um curso cadastrado");
            navigateTo('/TeacherPage');
            console.log("Erro ao criar curso");
        }
    } catch(err){
        console.log("Erro ao criar curso", err);
    }
  }
  
  return (
    <div className={styles.containerLogin}>
      <div className={styles.header}>
        CETAF <span>&#123; Ourinhos &#125; </span>
      </div>

      <div className={styles.containerTeacherHeader}>
        <h1>Área do Professor</h1><p>&gt; Criar curso</p>
      </div>

      <div className={styles.login_container}>
        <h2>Cadastrar Curso</h2>
        <form onSubmit={registerCourse}>
          <label htmlFor="nome">Nome do Curso: </label>
          <input type="text" id="nome" name="nome" required onChange={(e) => setName(e.target.value)}/>

          <label htmlFor="email">Descrição do Curso</label>
          <textarea
            id="description"
            name="description"
            required
            rows="5" 
            cols="40" 
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Digite a descrição do curso aqui"
          />

          <button type="submit" className={styles.btn}>Cadastrar Curso</button>
        </form>
      </div>

      <div className={styles.footer}>
        Todos os direitos reservados ao Centro de Ensino Tecnológico Agregado à Faculdade (CETAF) 2024.
      </div>

      <img className={styles.flag} src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/1024px-Flag_of_Brazil.svg.png" width="30" alt="Brazilian flag" />
    </div>
  );
}

export default CreateCourse;
