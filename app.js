const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const path = require('path');
const db = require('./db/connection')
const bodyParser = require('body-parser');
const Job = require('./models/Job');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`O express está rodando na port ${PORT}`);
})
//  // // // // // // // // // // // // // // // // //
// body-parser
app.use(bodyParser.urlencoded({ extended: false}));

// // // // // // // // // // // // // // // // // // 
// handlebars 
//onde ficará os templates do projeto (o diretório)
app.set('views', path.join(__dirname, 'views'));
// arquivo principal de layout
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// Qual frame será utilizado para renderizar as views
app.set('view engine', 'handlebars');

// // // // // // // // // // // // // // // // // //
//static folder
app.use(express.static(path.join(__dirname, 'public')));

// // // // // // // // // // // // // // // // // //
//db connection
db
    .authenticate()
    .then(() => {
        console.log('Conectou ao banco com sucesso.')
    })
    .catch(err => {
        console.log('Erro ao conctar', err);
    });

//  // // // // // // // // // // // // // // // // //
//routes
app.get('/', (req, res) => {

    let search = req.query.job;
    let query = '%'+search+'%'

    if (!search){
        Job.findAll({order: [
            ['createdAt', 'DESC']
        ]})
        .then(jobs => {

            res.render('index', {
                jobs
            });
        })
        .catch(err => console.log(err))
    } else {
        Job.findAll({
            where: {title: {[Op.like]: query}},
            order: [
              ['createdAt', 'DESC']
        ]})
        .then(jobs => {

            res.render('index', {
                jobs, search
            });
        })
        .catch(err => console.log(err))
    }

    
});

// // // // // // // // // // // // // // // // // // /
//jobs router
app.use('/jobs', require('./routes/jobs'));
