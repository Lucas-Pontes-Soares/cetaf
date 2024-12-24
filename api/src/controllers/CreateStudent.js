const connectionDB = require('./ConnectionDB');

module.exports = CreateStudents = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const dateBirth = req.body.dateBirth;

    try {
        const connection = await connectionDB();

        connection.query('SELECT * FROM students WHERE email = ?', [email], async (selectErr, selectResult) => {
            if (selectErr) {
                res.status(500).json({ error: 'Erro ao verificar email' });
                return;
            }
            
            if (selectResult.length > 0) {
                res.json({ success: false, message: "Esse email já está cadastrado"});
                return;
            }

            connection.query('INSERT INTO students (name, email, password, birthDate) VALUES (?, ?, ?, ?)', [name, email, password, dateBirth], (insertErr, insertResult) => {
                    connection.end();
                    if (insertErr) {
                        console.log(insertErr);
                        res.status(500).json({ error: 'Erro ao inserir aluno' });
                        return;
                    }

                    res.json({ success: true, message: "Aluno criado com sucesso!", studentId: insertResult.insertId });
                });
            })
    } catch(error){
        res.status(500).json({ error: 'Falha ao criar aluno' });
    }
}
