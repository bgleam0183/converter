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

        console.log("\n\n################# express Execute Value #################\n");
        console.log(result.rows);
        console.log("\n\n############## express Value Transfer Ended ##############\n")

        console.log(`express received Data : ${req.body.input}`);

        res.send(result.rows[0]);
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


app.post("/asd", (req, res) => {
    oraSelect(req, res);
});

app.listen(port, () => {
    console.log(`Port ${port}...`);
});