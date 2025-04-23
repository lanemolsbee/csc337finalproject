var http = require('http')
var url = require('url')
var fs = require('fs')
var qs = require('querystring')
var auth = require('./auth.js')
var {MongoClient} = require('mongodb')
var client = new MongoClient('mongodb://localhost:27017/userDB');
let db;

function getHTMLContent(fileName){
    try{
        return fs.readFileSync(fileName, {'encoding':'utf8'});
    }catch(err){
        console.log("Error reading file: ", err);
        return null;
    }
}

async function startServer(){
    try{
        await client.connect()
        console.log("Connected to MongoDB");
        db = client.db('userDB');
        const server = http.createServer(function(req, res){
            res.writeHead(200, {'Content-Type': 'text/html'});
            if(req.url == '/'){
                var htmlContent = getHTMLContent('index.html');
                if(htmlContent){
                    res.end(htmlContent);
                }
                else{
                    res.end("Error loading home page");
                }
            }
            else if(req.url == '/about'){
                var htmlContent = getHTMLContent('about.html');
                if(htmlContent){
                    res.end(htmlContent);
                }else{
                    readSync.end("Page not found");
                }
            }

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
