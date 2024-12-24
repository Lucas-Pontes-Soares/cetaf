const connectionDB = require('./ConnectionDB');
const nodemailer = require("nodemailer");

module.exports = CreateEnrollment = async (req, res) => {
    const courseId = req.body.courseId;
    const studentId = req.body.studentId;
    console.log(courseId);

    try {
        const connection = await connectionDB();

        connection.query('SELECT studentId FROM enrollments WHERE studentId = ?', [studentId], async (selectErr, selectResultE) => {
            if (selectResultE.length > 0) {
                res.json({ success: false, message: "Apenas 1 matrícula por aluno"});
                return;
            }
          
            connection.query('SELECT * FROM students WHERE id = ?', [studentId], async (selectErr, selectResultS) => {
                if (selectErr) {
                    res.status(500).json({ error: 'Erro ao verificar aluno' });
                    return;
                }
                
                const emailStudent = selectResultS[0].email;
                const nameStudent = selectResultS[0].name;
    
                
                if (selectResultS.length <= 0) {
                    res.status(400).json({ error: 'Não existe esse aluno'});
                    return;
                }
    
                connection.query('SELECT t.name, t.email FROM courses c INNER JOIN teachers t ON c.teacherId = t.id WHERE c.id = ?;', [courseId], async (selectErr, selectResultT) => {
                    if (selectErr) {
                        res.status(500).json({ error: 'Erro ao verificar professor'});
                        return;
                    }
    
                    const emailTeacher = selectResultT[0].email;
                    const nameTeacher = selectResultT[0].name;
    
                    connection.query('INSERT INTO enrollments (courseId, studentId, enrollmentDate) VALUES (?, ?, NOW())', [courseId, studentId], (insertErr, insertResult) => {
                        connection.end();
                        if (insertErr) {
                            console.log(insertErr);
                            res.status(500).json({ error: 'Erro ao inserir matricula' });
                            return;
                        }
                        
                        const transporter = nodemailer.createTransport({
                            host: 'mail8.cloudserver8.com',
                            port: 587,
                            secure: false, 
                            auth: {
                              user: 'lucas@iriz.com.br',
                              pass: '6Weo4<2BrR%c74ZS',
                            },
                        });
        
        
                        const mailOptions = {
                            from: 'lucas@iriz.com.br',
                            to: [`${emailStudent}, ${emailTeacher}`],
                            subject: 'CETAF | Nova Matricula Realizada',
                            text: `
    Nova Matrícula Realizada com sucesso!
    
    Prezado(a) ${nameStudent},
    Seja bem-vindo à nossa plataforma de cursos online! Estamos muito felizes por tê-lo como aluno e estamos ansiosos para começar a sua jornada de aprendizado.
    Professor: ${nameTeacher}
    
    Atenciosamente,
    Equipe CETAF
        `
                        };
        
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.error('Erro ao enviar o email:', error);
                                res.status(500).json({ error: 'Erro ao enviar o email', erro: error });
                            } else {
                                console.log('Email do resultado enviado com sucesso');
                                res.json({ success: true, message: "Matricula criado com sucesso!", enrollmentId: insertResult.insertId });
                            }
                        });
                    });
                });
            })
        })
    } catch(error){
        res.status(500).json({ error: 'Falha ao curso matricula' });
    }
}
