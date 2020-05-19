const express = require('express');
const app = express();
const db = require('./db/connection')
const bodyParser = require('body-parser');

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`O express está rodando na port ${PORT}`);
})

// body-parser
app.use(bodyParser.urlencoded({ extended: false}));

//db connection
db
    .authenticate()
    .then(() => {
        console.log('Conectou ao banco com sucesso.')
    })
    .catch(err => {
        console.log('Erro ao conctar', err);
    });

//routes
app.get('/', (req, res) => {
    res.send('Está funcionando.');
});

//jobs router
app.use('/jobs', require('./routes/jobs'));