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
var database = require('./database.js')
var {MongoClient} = require('mongodb')
var client = new MongoClient('mongodb://localhost:27017/userDB');
let db;

/**
 * This function synchronously reads the contents of fileName and returns those contents
 * if the file name exists, and null otherwise
 * @param {String} fileName 
 * @returns - String giving the contents of fileName
 */
function getHTMLContent(fileName){
    try{
        return fs.readFileSync(fileName, {'encoding':'utf8'});
    }catch(err){
        console.log("Error reading file: ", err);
        return null;
    }
}
/**
 * This function updates the URLs for all the links on a page. 
 */
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
/**
 * This function consolidates the task of sending responses so the code in it is not
 * repeated throughout the server. 
 * @param {http.ServerResponse} res - the response object
 * @param {String} htmlContent - a string giving the HTML content of the file
 */
function resEnd(res, htmlContent){
    if(htmlContent){
        res.end(htmlContent);
    }else{
        res.end('Page not found');
    }
}

/**
 * This function acts as a wrapper for starting the server and connecting
 * the server to the MongoDB database
 */
async function startServer(){
    try{
        await client.connect()
        console.log("Connected to MongoDB");
        db = client.db('userDB');
        const server = http.createServer(function(req, res){
            res.writeHead(200, {'Content-Type': 'text/html'});
            if(req.url == '/'){
                var htmlContent = getHTMLContent('index.html');
                resEnd(res, htmlContent);
            }
            else if(req.url == '/about'){
                var htmlContent = getHTMLContent('about.html');
                resEnd(res, htmlContent);
            }
            else if(req.url.includes("login")){
                var htmlContent = getHTMLContent('login.html');
                resEnd(res, htmlContent);
            }
            else if(req.url.includes('login-form')){
                var body = ''
                req.on('data', function(s){
                    body += s
                });
                req.on('end', async function(){
                    var query = qs.parseBody(body);
                    var canLogin = await auth.checkLogin(db, query.name, auth.hashPassword(query.password), query.role);
                    if(canLogin){
                        if(query.role == 'buyer'){
                            var htmlContent = getHTMLContent('user-purchases.html');
                            res.url = '/purchase-history';
                        }else if(query.role == 'seller'){
                            var htmlContent = getHTMLContent('listings.html');
                            res.url = "/inventory";
                        }else{
                            var htmlContent = getHTMLContent('admin_reports.html');
                            res.url = '/reports';
                        }
                        res.end(htmlContent);
                    }else{
                        res.end(getHTMLContent('login.html') + '<p>Invalid login credenetials, please try again</p>')
                    }
                })
            }
            else if(req.url.includes('create_user')){
                var htmlContent = getHTMLContent('create_user.html');
                resEnd(res, htmlContent);
            }
            else if(req.url.includes('success')){
                var htmlContent = getHTMLContent('success.html');
                resEnd(res, htmlContent);
            }
            else if(req.url.includes('create_user_submit')){
                var body = ''
                req.on('data', function(s){
                    body += s
                });
                req.on('end', async function(){
                    var query = qs.parseBody(body);
                    await database.addUser(db, query);
                    var htmlContent = getHTMLContent('success.html');
                    resEnd(res, htmlContent);
                })
            }
            /**
             * ADD IN STUFF TO SERVE THE LISTINGS FORM HERE
             */
            else if(req.url.includes('listings')){
                
            }
            /**
             * ADD STUFF TO SERVE THE STORE.HTML FILE HERE
             */
            else if(req.url.includes("store")){

            }
            /**
             * ADD IN STUFF TO SERVE THE LOGOUT HERE
             */
            else if(req.url.includes('logout')){
                var htmlContent = getHTMLContent('logout.html');
                resEnd(res, htmlContent);
            }
            
            /**
             * ADD IN STUFF TO SERVE THE REPORT FILE HERE
             */
            else if(req.url.includes('submit-report')){
                var htmlContent = getHTMLContent('report.html');
                resEnd(res, htmlContent);
            }
            else if(req.url.includes('submit_report')){

            }
            /**
             * ADD IN STUFF TO SERVE THE STORE FILE HERE
             */
            else if(req.url.includes("reports")){

            }
            /**
             * ADD IN STUFF TO SERVE THE UPLOAD BOOK FILE HERE
             */
            else if(req.url.includes('upload-book')){

            }
            else if(req.url.includes('submit-book')){

            }
            /**
             * ADD IN STUFF TO SERVE THE USER-PURCHASES HERE
             */
            else if(req.url.includes('purchase-history')){

            }
            /**
             * ADD IN STUFF TO SERVE THE REPORTS FOR ADMINS TO READ
             */
            else if(req.url.includes('view-reports')){

            }
            else if(req.url.includes('source.js')){
                try{
                    var content = fs.readFileSync('source.js', {'encoding':'utf8'})
                    res.end(content)
                }catch(err){
                    console.log(err)
                }
            }else{
                res.end('Page not found');
            }
        })
        server.listen(8080, ()=>{
            console.log("server is listening on http://localhost:8080");
        })
    }
    catch(err){
        console.error("Failed to start server:", err);
    }
}
startServer();
