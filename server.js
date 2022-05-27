const express        = require('express');
const bodyParser     = require('body-parser');
const { urlencoded } = require('body-parser');
const path           = require('path');
const db             = require('oracledb');
const dbInfo         = require('./dbinfo.js');

// test
var connection;
// connection = db.getConnection(dbInfo);

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DB Function
db.outFormat    = db.OUT_FORMAT_OBJECT;
db.autoCommit   = true;

async function oraConnect() {
    connection = await db.getConnection(dbInfo);
    console.log("db Connected")
}

async function oraSelect(req, res) {
    // let connection;

    try {
        // connection = await db.getConnection(dbInfo);

        console.log(`## received Data\n${req.body.input}`);

        console.log("## execute Query\n"+ `SELECT * FROM TB_MAPPING WHERE 1=1 AND GUBUN = 'PHP' AND ASIS_ID = '${req.body.input}'`);

        var result = await connection.execute(`SELECT * FROM TB_MAPPING WHERE 1=1 AND GUBUN = 'PHP' AND ASIS_ID = :asis`, [`${req.body.input}`]);

        console.log("\n\n## server.js > oraSelect\n################# express Execute Value #################\n");
        console.log(result);
        console.log("\n\n############## express Value Transfer Ended ##############\n")

        if( result.rows.length == 1 ) {
            res.send(result.rows);
        } else {
            res.send([{TOBE_ID: "error_occured. Too many records loaded."}]);
        }
    } catch (err) {
        console.log(err);
    } /* finally {
        try {
            await connection.close();
        } catch (err) {
            console.log(err);
        }
    } */
}

app.post("/", (req, res) => {
    console.log("Reached");
    oraConnect();
});


app.post("/asd", (req, res) => {
    oraSelect(req, res);
});

app.listen(port, () => {
    console.log(`Port ${port}...`);
});