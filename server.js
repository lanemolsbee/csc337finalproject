/**
 * File: server.js
 * Author: Lane Molsbee
 * Purpose: This file contains the bulk of the server code and keeps track of serving the dynamic
 * files. It imports various modules needed to run the server including the modules for http, url,
 * file system, querystrings, password authorization, database interactions, and the database itself
 * 
 * This server makes use of a MongoDB database to store user information.
 */
var http = require('http')
var url = require('url')
var fs = require('fs')
var qs = require('querystring')
var auth = require('./auth.js')
var database = require('/database.js')
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

function updateUrls(){
    var username = window.localStorage.getItem('username')
    var role = window.localStorage.getItem("role")
    if(username!=null && role!=null){
        var alist = document.getElementsByTagName('a')
        for(var i=0;i<alist.length;i++)
        {
            var par = '?username=' + username + "&role=" + role;
            alist[i].href += par
        }
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
