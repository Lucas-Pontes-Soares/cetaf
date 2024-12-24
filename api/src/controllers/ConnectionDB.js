const mysql = require('mysql');

async function connectionDB(){
    const connection = mysql.createConnection({
        host: 'localhost', 
        user: 'root',
        password: '', 
        database: 'db_cetaf' 
    });
    
   
    connection.connect((err) => {
        if (err) {
          //error('Erro ao conectar ao banco de dados:', err);
          return
        }
       //console.log('Conexão bem-sucedida com o banco de dados!');
    });
    
    connection.close = () => {
        connection.end((err) => {
            if (err) {
                console.error('Erro ao fechar a conexão com o banco de dados:', err);
            } else {
                console.log('Conexão com o banco de dados fechada com sucesso.');
            }
        });
    }; 
    
    return connection;

}

module.exports = connectionDB;