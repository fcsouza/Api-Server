const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const sql = require('mssql');



//conectando ao Banco de Dados
const connStr = "Server=mssql914.umbler.com,5003;Database=med;User Id=fabricio2;Password=49.X)YeffF;";


//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);


//Exibe Todos os Dados
router.get('/api/medicos/:id?', (req, res) =>{
    let filter = '';
    if(req.params.id) filter = ' WHERE COD_MED=' + parseInt(req.params.id);
    execSQLQuery('SELECT * FROM medicos' + filter, res);
})

//Exibe Todos os dados da 2º tabela
router.get('/api/todos/:id?', (req, res) =>{
    let filter = '';
    if(req.params.id) filter = ' WHERE COD_ACESSO=' + parseInt(req.params.id);
    execSQLQuery('SELECT * FROM acesso' + filter, res);
})


//Deleta os Dados baseado no id
router.delete('/api/medicos/:id', (req, res) =>{
    execSQLQuery('DELETE medicos WHERE COD_MED=' + parseInt(req.params.id), res);
})


//configurando o body parser para pegar POSTS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Insere novos Dados baseado
router.post('/api/medicos', (req, res) =>{
    const cod_med = parseInt(req.body.cod_med);
    const nome = req.body.nome.substring(0,150);
    const funcao = req.body.funcao.substring(0,150);
    const estado = req.body.estado.substring(0,150);
    const cod_acesso = parseInt(req.body.cod_acesso);
    execSQLQuery(`INSERT INTO medicos(COD_MED, NOME, FUNCAO, ESTADO, COD_ACESSO) VALUES(${cod_med},'${nome}','${funcao}','${estado}',${cod_acesso})`, res);
})


//Modifica os dados sem alterar o id
router.patch('/api/medicos/:id', (req, res) =>{
    const cod_med = parseInt(req.params.id);
    const nome = req.body.nome.substring(0,150);
    const funcao = req.body.funcao.substring(0,150);
    const estado = req.body.estado.substring(0,150);
    const cod_acesso = parseInt(req.body.cod_acesso);
    execSQLQuery(`UPDATE medicos SET NOME='${nome}', FUNCAO='${funcao}', ESTADO='${estado}', COD_ACESSO='${cod_acesso}' WHERE COD_MED=${cod_med}`, res);
})


//fazendo a conexão global
sql.connect(connStr)
   .then(conn => {
        global.conn = conn;
        //inicia o servidor
        app.listen(port);
        console.log('API funcionando!');
   })
   .catch(err => console.log(err));

function execSQLQuery(sqlQry, res){
    global.conn.request()
               .query(sqlQry)
               .then(result => res.json(result.recordset))
               .catch(err => res.json(err));
}

