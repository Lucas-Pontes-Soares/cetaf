const connectionDB = require('./ConnectionDB');

module.exports = GetStudents = async (req, res) => {
    const studentId = req.body.studentId;

    try {
        const connection = await connectionDB();

        connection.query('SELECT * FROM students WHERE id = ?', [studentId], async (selectErr, selectResult) => {
            connection.end();
            if (selectErr) {
                res.status(500).json({ error: 'Erro ao buscar aluno' });
                return;
            }
            
            if (selectResult.length <= 0) {
                res.status(400).json({ error: 'Esse aluno não existe'});
                return;
            }

            selectResult.forEach(student => {
                delete student.password;
            });

            res.json({ success: true, message: "Aluno buscado com sucesso!", student: selectResult });
        })
    } catch(error){
        res.status(500).json({ error: 'Falha ao buscar aluno' });
    }
}
