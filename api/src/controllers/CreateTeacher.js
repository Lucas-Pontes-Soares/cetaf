const connectionDB = require('./ConnectionDB');

module.exports = CreateTeacher = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const dateBirth = req.body.dateBirth;
    const idPhoto = req.body.photo;

    try {
        const connection = await connectionDB();

        connection.query('SELECT * FROM teachers WHERE email = ?', [email], async (selectErr, selectResult) => {
            if (selectErr) {
                res.status(500).json({ error: 'Erro ao verificar email' });
                return;
            }
            
            if (selectResult.length > 0) {
                res.json({ success: false, message: "Esse email já está cadastrado"});
                return;
            }

            connection.query('INSERT INTO teachers (name, email, password, birthDate, idPhoto) VALUES (?, ?, ?, ?, ?)', [name, email, password, dateBirth, idPhoto], (insertErr, insertResult) => {
                connection.end();    
                    if (insertErr) {
                        console.log(insertErr);
                        res.status(500).json({ error: 'Erro ao inserir professor' });
                        return;
                    }

                    res.json({ success: true, message: "Professor criado com sucesso!", teacherId: insertResult.insertId });
                });
            })
    } catch(error){
        res.status(500).json({ error: 'Falha ao criar professor' });
    }
}
