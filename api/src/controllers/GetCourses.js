const connectionDB = require('./ConnectionDB');

module.exports = GetCourses = async (req, res) => {
    try {
        const connection = await connectionDB();

        connection.query('SELECT * FROM courses', async (selectErr, selectResult) => {
            connection.end();
            if (selectErr) {
                res.status(500).json({ error: 'Erro ao buscar cursos' });
                return;
            }
            
            if (selectResult.length <= 0) {
                res.status(400).json({ error: 'Não existe nenhum curso'});
                return;
            }

            res.json({ success: true, message: "Curso buscado com sucesso!", courses: selectResult });
        })
    } catch(error){
        res.status(500).json({ error: 'Falha ao buscar curso' });
    }
}
