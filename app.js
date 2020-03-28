const http = require("http");
const fs = require("fs");
const url = require("url");
const dateformat = require("dateformat");

const DATA_FILE = "data.json";

let citac = 0;
let zpravy = new Array();
if (fs.existsSync(DATA_FILE)) {
    zpravy = JSON.parse(fs.readFileSync(DATA_FILE));
}

function main(req,res) {
    console.log(req.url);
    if (req.url == "/") {
        res.writeHead(200, {"Content-type":"text/html"});
        let s = fs.readFileSync("index.html");
        res.end(s);
    } else if (req.url == "/citac") {
        citac++;
        let obj = {};
        obj.citac = citac;
        obj.popis = "muj prvni JSON ze serveru";
        res.writeHead(200, {"Content-type":"application/json"});
        res.end(JSON.stringify(obj));
    } else if (req.url.startsWith("/chat/list")) {
        let obj = {};
        obj.messages = zpravy;
        res.writeHead(200, {"Content-type":"application/json"});
        res.end(JSON.stringify(obj));
    } else if (req.url.startsWith("/chat/add")) {
        let q = url.parse(req.url, true);
        console.log(q.query);
        let o = {};
        o.text = q.query.msg;
        o.nickname = q.query.nick;
        o.time =  dateformat(new Date(), "dd.mm.yyyy HH:MM:ss");
        zpravy.push(o);
        fs.writeFileSync(DATA_FILE, JSON.stringify(zpravy));
        let obj = {};
        obj.messages = zpravy;
        res.writeHead(200, {"Content-type":"application/json"});
        res.end(JSON.stringify(obj));
    } else {
        res.writeHead(404, {"Content-type":"text/html"});
        res.end();
    }
}

let srv = http.createServer(main);
srv.listen(8080);
console.log("Bezi na http://localhost:8080");