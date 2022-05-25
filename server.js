const express        = require('express');
const bodyParser     = require('body-parser');
const { urlencoded } = require('body-parser');
const path           = require('path');
const db             = require('oracledb');
const dbInfo         = require('./dbinfo.js');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DB Function
db.outFormat    = db.OUT_FORMAT_OBJECT;
db.autoCommit   = true;

async function oraSelect(req, res) {
    let connection;

    try {
        connection = await db.getConnection(dbInfo);

        var result = await connection.execute(`SELECT * FROM TB_TEST WHERE 1=1`, []);

        console.log(result);
        res.send(result);
        // res.end();
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

app.get("/asd", (req, res) => {
    oraSelect(req, res);
});

app.listen(port, () => {
    console.log(`Port ${port}...`);
});