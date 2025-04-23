var http = require('http')
var url = require('url')
var fs = require('fs')
var qs = require('querystring')
var auth = require('./auth.js')
var {MongoClient} = require('mongodb')
var client = new MongoClient('mongodb://localhost:27017/userDB');
let db;

async function startServer(){
    try{
        await client.connect()
        console.log("Connected to MongoDB");
        db = client.db();
        const server = http.createServer(async function(req, res){
            res.writeHead(200, {'Content-Type': 'text/html'});
        })
        server.listen(8080, ()=>{
            console.log("server is listening on http://localhost:8080");
        })
    }
    catch(err){
        console.error("Failed to starat server:", err);
    }
}
startServer();
