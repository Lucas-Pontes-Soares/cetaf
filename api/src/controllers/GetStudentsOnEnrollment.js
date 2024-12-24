const connectionDB = require('./ConnectionDB');

module.exports = GetStudentsOnEnrollment = async (req, res) => {
    const teacherId = req.body.teacherId; 

    try {
        const connection = await connectionDB();

        connection.query(
            'SELECT * FROM courses WHERE teacherId = ?', 
            [teacherId], 
            async (selectErr, coursesResult) => {
                if (selectErr) {
                    res.status(500).json({ error: 'Erro ao buscar cursos' });
                    return;
                }

                if (coursesResult.length <= 0) {
                    res.status(400).json({ error: 'Nenhum curso encontrado para esse professor' });
                    return;
                }

                const courseIds = coursesResult.map(course => course.id);

                connection.query(
                    'SELECT * FROM enrollments WHERE courseId IN (?)',
                    [courseIds],
                    async (enrollmentErr, enrollmentsResult) => {
                        if (enrollmentErr) {
                            res.status(500).json({ error: 'Erro ao buscar matrículas' });
                            return;
                        }

                        if (enrollmentsResult.length <= 0) {
                            res.status(400).json({ error: 'Nenhuma matrícula encontrada para os cursos' });
                            return;
                        }

                        const studentIds = enrollmentsResult.map(enrollment => enrollment.studentId);

                        connection.query(
                            'SELECT * FROM students WHERE id IN (?)',
                            [studentIds],
                            (studentsErr, studentsResult) => {
                                connection.end();
                                if (studentsErr) {
                                    res.status(500).json({ error: 'Erro ao buscar alunos' });
                                    return;
                                }

                                if (studentsResult.length <= 0) {
                                    res.status(400).json({ error: 'Nenhum aluno encontrado' });
                                    return;
                                }

                                res.json({
                                    success: true,
                                    message: "Alunos matriculados nos cursos encontrados com sucesso!",
                                    students: studentsResult
                                });
                            }
                        );
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Falha ao buscar dados' });
    }
};
