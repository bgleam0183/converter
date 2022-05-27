const express        = require('express');
const bodyParser     = require('body-parser');
const { urlencoded } = require('body-parser');
const path           = require('path');
const db             = require('oracledb');
const dbInfo         = require('./dbinfo.js');
var   connection;

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DB Function
db.outFormat    = db.OUT_FORMAT_OBJECT;
db.autoCommit   = true;

async function oraSelect(req, res) {
    // let connection;

    try {
        // connection = await db.getConnection(dbInfo);

        console.log(`express received Data : ${req.body.input}`);

        var result = await connection.execute(`SELECT * FROM TB_MAPPING WHERE 1=1 AND GUBUN = 'PHP' AND ASIS_ID = :asis`, [`${req.body.input}`]);

        console.log("\n\n################# express Execute Value #################\n");
        console.log(result.rows);
        console.log("\n\n############## express Value Transfer Ended ##############\n")

        

        res.send(result.rows);
    } catch (err) {
        console.log(err);
    } finally {
        try {
            await connection.close();
        } catch (err) {
            console.log(err);
        }
    }
}


async function oraConnect(req, res) {
    try {
        connection = await db.getConnection(dbInfo);
        res.send('DB Connected');
        console.log('DB Connected');
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}

async function oraDisconnect(req, res) {
    try {
        // this Method Occured error.
        // connection.close();
        res.send('DB Disconnected');
        console.log('DB Disconnected');
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}


app.post("/dbCon", (req, res) => {
    oraConnect(req, res);
});

app.post("/dbDis", (req, res) => {
    oraDisconnect(req, res);
})

app.post("/asd", (req, res) => {
    oraSelect(req, res);
});

app.listen(port, () => {
    console.log(`Port ${port}...`);
});