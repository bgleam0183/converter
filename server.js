const express        = require('express');
const bodyParser     = require('body-parser');
const { urlencoded } = require('body-parser');
const path           = require('path');
const db             = require('oracledb');
const dbInfo         = require('./dbinfo.js');
var   connection;

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

async function oraConnect(req, res) {
    try {
        connection = await db.getConnection(dbInfo);
    } catch (err) {
        console.log("DB Connect Fail");
        res.send(err);
    }
    
    console.log("db Connected")
    res.send("DB is Now Connected");
}

async function oraDisConnect(req, res) {
    try {
        connection.close();
    } catch (err) {
        console.log(err);
        res.send(err);
    }
    console.log("db Disconnected");
    res.send("DB is Now Disconnected");
}

async function oraSelect(req, res) {
    // let connection;

    try {
        // connection = await db.getConnection(dbInfo);

        console.log(`## received Data\n${req.body.input}`);

        console.log("## execute Query\n"+ `SELECT * FROM TB_PHP`);

        // var result = await connection.execute(`SELECT * FROM TB_PHP WHERE 1=1 AND STRUC = :asis`, [`${req.body.input}`]);
        var result = await connection.execute(`SELECT A.NO AS NO_PHP, A.STRUC AS STRUC_PHP, B.NO AS NO_JSP, B.STRUC AS STRUC_JSP FROM TB_PHP A, TB_JSP B WHERE 1=1 AND A.NO = B.NO`);

        console.log("\n\n## server.js > oraSelect\n################# express Execute Value #################\n");
        console.log(result);
        console.log("\n\n############## express Value Transfer Ended ##############\n")

        if( true ) {
            res.send(result.rows);
        } else {
            res.send({ message: "error_occured. Too many records loaded." });
        }
    } catch (err) {
        console.log(err);
        res.send({ message: "No DB Connection" });
    }
}

app.post("/c", (req, res) => {
    console.log("Reached to Connect Activation");
    oraConnect(req, res);
});

app.post("/dc", (req, res) => {
    console.log("Reached to Disconnect Activation");
    oraDisConnect(req, res);
})


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