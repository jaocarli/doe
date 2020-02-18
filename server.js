const express = require("express")
const server = express()

// apresentar arquivos estáticos
server.use(express.static('public'))

// body formulário
server.use(express.urlencoded({ extended: true}))

// configurar conexão ao banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

// template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
  express: server,
  noCache: true,
})

server.get("/", function(req, res){


  db.query("SELECT * FROM donors", function(err, result) {
    if (err) return res.send("Erro de banco de dados")
    
    const donors = result.rows
    return res.render("index.html", { donors })


  })
  
})

server.post("/", function (req, res) {
  const name = req.body.name
  const email = req.body.email
  const blood = req.body.blood

  if (name == "" || email == "" || blood == "") {
      return res.send("Todos os campos são obrigatórios.")
  }

  // valores dentro do db
  const query = `INSERT INTO donors ("name", "email", "blood")
  VALUES ($1, $2, $3)`
  
  const values =  [name, email, blood]
  
  db.query(query, values, function(err) {
    // fluxo de erro
    if (err) return res.send("erro no banco de dados.")

    // fluxo ideal
    return res.redirect("/")
  })


})

server.listen(3000, function() {
  console.log("cheguei! =D")
})