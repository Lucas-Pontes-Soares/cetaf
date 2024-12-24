const connectionDB = require('./ConnectionDB');

module.exports = GetCourseByTeacher = async (req, res) => {
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
                connection.end();
                if (selectErr) {
                    res.status(500).json({ error: 'Erro ao buscar professor' });
                    return;
                }
                
                if (selectResult.length <= 0) {
                    res.json({ success: false, message: "Professor não possui curso"});
                    return;
                }

                res.json({ success: true, message: "Professor possui curso", course: selectResult });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Falha ao buscar curso' });
    }
}
