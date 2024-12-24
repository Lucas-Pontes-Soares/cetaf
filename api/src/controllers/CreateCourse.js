const connectionDB = require('./ConnectionDB');

module.exports = CreateCourse = async (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const teacherId = req.body.teacherId;

    try {
        const connection = await connectionDB();

        connection.query(
            `SELECT 
                courses.*, 
                teachers.name AS teacherName, 
                courses.name AS courseName,
                teachers.idPhoto as teacherIdPhoto
            FROM courses 
            INNER JOIN teachers 
            ON teachers.id = courses.teacherId 
            WHERE teacherId = ?`, 
            [teacherId], 
            async (selectErr, selectResult) => {
                if (selectErr) {
                    res.status(500).json({ error: 'Erro ao buscar professor' });
                    return;
                }
                
                if (selectResult.length > 0) {
                    res.json({ success: false, message: "Professor já possui curso"});
                    return;
                }

                connection.query('SELECT * FROM teachers WHERE id = ?', [teacherId], async (selectErr, selectResult) => {
                    if (selectErr) {
                        res.status(500).json({ error: 'Erro ao verificar professor', msg: selectErr });
                        return;
                    }
                    
                    if (selectResult.length <= 0) {
                        res.status(400).json({ error: 'Não existe esse professor'});
                        return;
                    }
        
                    connection.query('INSERT INTO courses (name, description, teacherId) VALUES (?, ?, ?)', [name, description, teacherId], (insertErr, insertResult) => {
                        connection.end();    
                        if (insertErr) {
                            console.log(insertErr);
                            res.status(500).json({ error: 'Erro ao inserir curso' });
                            return;
                        }
        
                        res.json({ success: true, message: "Curso criado com sucesso!", courseId: insertResult.insertId });
                    });
                })
        });
    } catch(error){
        res.status(500).json({ error: 'Falha ao curso professor' });
    }
}
