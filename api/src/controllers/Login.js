const connectionDB = require('./ConnectionDB');

module.exports = Login = async (req, res) => {
    const type = req.body.type;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const connection = await connectionDB();

        if(type == 1){
            connection.query('SELECT * FROM students WHERE email = ? AND password = ?', [email, password], async (selectErr, selectResult) => {
                connection.end();
                if (selectErr) {
                    res.status(500).json({ error: 'Erro ao verificar email' });
                    return;
                }
                
                if (selectResult.length <= 0) {
                    res.json({ success: false, message: "Email ou senha invalidos"});
                    return;
                } 

                res.json({ success: true, message: "Aluno logado com sucesso!", userId: selectResult[0].id });
            })
        } else if (type == 2){
            connection.query('SELECT * FROM teachers WHERE email = ? AND password = ?', [email, password], async (selectErr, selectResult) => {
                connection.end();
                if (selectErr) {
                    res.status(500).json({ error: 'Erro ao verificar email' });
                    return;
                }
                
                if (selectResult.length <= 0) {
                    res.json({ success: false, message: "Email ou senha invalidos"});
                    return;
                } 

                res.json({ success: true, message: "Professor logado com sucesso!", userId: selectResult[0].id });
            })
        } else {
            console.log("Tipo de login invalido");
            throw new Error("Tipo de login invalido");
        }
    } catch(error){
        res.status(500).json({ error: 'Falha ao criar aluno' });
    }
}
