const express = require("express");
const expFileUplaod = require('express-fileupload');
const dr = require('./dr');
const fs = require('fs');
const path = require('path');
const scatterplot = require('./scatterplot');
const scpMatrix = require('./scpMatrix')

var app = express();
const router = express.Router();
const apiRouter = express.Router();
const port = 5000;
const rootPath = path.join(__dirname, '..', 'public');

// Pagina iniziale
router.get('/', (req, res) => {
    res.sendFile('index.html', { root: rootPath });
});

// Cercare di accedere normalmente alla pagina del grafico ritorna alla scelta dei dati
router.get('/graph', (req, res) => {
    res.redirect('/');
});

// Save data from post form
router.post('/graph', function (req, res, next) {
    // Permette di caricare un file arbitrario senza dover sceglierlo ogni volta
    if (req.body.bypass == "on") { 
        fs.readFile(path.join(__dirname, '../data_test', 'iris_dataset.csv'), 'utf8', (err, data) => {
            if (err) console.error(err);
            req.files = new Object();
            req.files.data_file = data;
            req.body.select_grafico = 'scpm';
            req.body.riduzione = 'pca';
            next();
        });
    }
    else if (req.files === null || req.files === undefined) return res.sendStatus(400);
        
    // per ora salva il file in una cartella, possibile anche non salvando il file
    else if (req.files.data_file) { 
        let data_file = req.files.data_file;
        if(req.body.bypass !== "on") {
            data_file.mv(path.join(__dirname, '../data_test', data_file.name), (err) => {
                if (err) {
                    console.error(err);
                    return res.sendStatus(500);
                }
                console.log(`Saved ${data_file.name}`);
            });
            req.files.data_file = data_file.data.toString('utf8');
            next();
        }
    }
    else {
        console.log("data_file undefined");
        res.send("Ayo bruv something's wrong with the file");
    }
}, dimRed, showData);

apiRouter.post('/graph', function (req, res, next) {
    if (req.body.bypass == "on") {
        fs.readFile(path.join(__dirname, '../data_test', 'iris_dataset.csv'), 'utf8', (err, data) => {
            if (err) console.error(err);
            req.files = new Object();
            req.files.data_file = data;
            req.body.select_grafico = 'scp';
            req.body.riduzione = 'pca';
            next();
        });
    }
    // else if (req.files === null || req.files === undefined) return res.sendStatus(400);
    else if (req.files === null || req.files === undefined) return res.status(400).json({ msg: "Nessun file" });

    // per ora salva il file in una cartella, possibile anche non salvando il file
    else if (req.files.data_file) {
        let data_file = req.files.data_file;
        if (req.body.bypass !== "on") {
            data_file.mv(path.join(__dirname, '../data_test', data_file.name), (err) => {
                if (err) {
                    console.error(err);
                    // return res.sendStatus(500);
                    return res.status(500).json({ msg: "Errore interno" });
                }
                console.log(`Saved ${data_file.name}`);
            });
            req.files.data_file = data_file.data.toString('utf8');
            next();
        }
    }
    else {
        console.log("data_file undefined");
        res.status(400).json({ msg: "Ayo bruv something's wrong with the file" });
    }
}, dimRed, returnPageString);

app.use('/', express.json());
app.use('/', express.urlencoded({ extended: false }));
app.use(expFileUplaod());
app.use('/api', apiRouter);
app.use('/', router);

app.listen(port, () => {
    console.log("App started");
});


// Riduzione dimensionale
function dimRed(req, res, next) {
    let data = req.files.data_file;
    // Conversione string => float
    data = data.split("\n");
    let temp = [];
    const colNumber = data[0].split(',').length - 1; // solo per iris
    for (let i = 1; i < data.length; i++) {
        data[i] = data[i].split(',');
        temp[i] = data[i][colNumber]; // solo per iris
        data[i] = data[i].map(x => +x);
    }
    /* if(req.body.select_grafico !== 'scpm') {
        data = reduce(data, req.body.riduzione, 2);
        if (data === false) return res.status(500).json({ msg: "Algoritmo di riduzione non ancora implementato" });
    } */
    // solo per iris
    for(let i = 1; i < data.length; i++) {
        data[i][colNumber] = temp[i];
    }
    req.columns = data[0];
    data[0] = req.columns.split(',');
    req.data = data;

    next();
}

// Carica pagina
function showData(req, res) {
    let data = req.data;
    let columns = req.columns;
    let graph_type = req.body.select_grafico;
    // Ritorna la pagina graph.html aggiungendo il grafico
    let result = plotData(data, graph_type, columns, false);
    if (result === false)
        res.send(400, 'Grafico non supportato')
    else
        res.writeHead(200, { "Content-Type": 'text/html' }).end(result);
}

function returnPageString(req, res) {
    let svg = plotData(req.data, req.body.select_grafico, req.columns, true);
    if (svg === false)
        return res.status(400).json({ msg: 'Grafico non supportato' });
    return res.json({ svg });
}

function plotData(data, select_grafico, columns, isAPI) {
    let result;
    switch (select_grafico) {
        case 'scp':
            try{result = scatterplot(data, isAPI);}
            catch(err){result = { err };}
            break;
        case 'scpm':
            try{result = scpMatrix(data, columns, isAPI);}
            catch(err){result = { err };}
            break;
        default:
            result = false;
            break;
    }
    return result;
}

function reduce(data, red, dim) {
    let result;
    switch (red) {
        case "pca":
            result = dr.PCA(data, dim);
            break;
        default:
            result = false;
            break;
    }
    return result;
}