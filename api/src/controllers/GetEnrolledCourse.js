const connectionDB = require('./ConnectionDB');

module.exports = GetEnrolledCourse = async (req, res) => {
    const studentId = req.body.studentId;

    try {
        const connection = await connectionDB();

        connection.query('SELECT * FROM enrollments INNER JOIN courses ON courses.id = enrollments.courseId WHERE studentId = ?', [studentId], async (selectErr, selectResult) => {
            connection.end();
            if (selectErr) {
                res.status(500).json({ error: 'Erro ao buscar matriculas' });
                return;
            }
            
            if (selectResult.length <= 0) {
                res.json({ success: false, message: "Aluno não matriculado"});
                return;
            }

            res.json({ success: true, message: "Aluno matriculado em algum curso", enrollments: selectResult });
        })
    } catch(error){
        res.status(500).json({ error: 'Falha ao buscar curso' });
    }
}
