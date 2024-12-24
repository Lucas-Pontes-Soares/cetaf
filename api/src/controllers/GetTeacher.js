const connectionDB = require('./ConnectionDB');

module.exports = GetTeacher = async (req, res) => {
    const teacherId = req.body.teacherId;

    try {
        const connection = await connectionDB();

        connection.query('SELECT * FROM teachers WHERE id = ?', [teacherId], async (selectErr, selectResult) => {
            connection.end();
            if (selectErr) {
                res.status(500).json({ error: 'Erro ao buscar professor' });
                return;
            }
            
            if (selectResult.length <= 0) {
                res.status(400).json({ error: 'Esse professor não existe'});
                return;
            }

            selectResult.forEach(teacher => {
                delete teacher.password;
            });

            res.json({ success: true, message: "Professor buscado com sucesso!", teacher: selectResult });
        })
    } catch(error){
        res.status(500).json({ error: 'Falha ao buscar professor' });
    }
}
