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

async function getStoreInventory(){
    try{
        var coll = db.collection("listings");
        var docs = await coll.find({}).toArray()
        return docs;
    }catch(err){
        console.log(err);
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
        const server = http.createServer(async function(req, res){
            //Serve index.html
            if(req.url.includes('/home') || req.url == '/'){
                res.writeHead(200, {'Content-Type': 'text/html'});
                var htmlContent = getHTMLContent('index.html');
                resEnd(res, htmlContent);
            }
            //Serve about.html
            else if(req.url.includes('about')){
                res.writeHead(200, {'Content-Type': 'text/html'});
                var htmlContent = getHTMLContent('about.html');
                resEnd(res, htmlContent);
            }
            //Serve login.html and the action associated with the login form
            else if(req.url.includes("login")){
                res.writeHead(200, {'Content-Type': 'text/html'});
                var htmlContent = getHTMLContent('login.html');
                resEnd(res, htmlContent);
            }
            else if(req.url.includes('log-in-action')){
                res.writeHead(200, {'Content-Type': 'text/html'});
                var body = ''
                req.on('data', function(s){
                    body += s
                });
                req.on('end', async function(){
                    var query = qs.parse(body);
                    var canLogin = await auth.checkLogin(db, query.username, query.password, query.role);
                    if(canLogin){
                        if(query.role == 'buyer'){
                            var storeContents = await getStoreInventory();
                            if(storeContents.length == 0){
                                res.end('The store is currently empty');
                            }
                            var items = JSON.stringify(storeContents);
                            if(storeContents.length == 0){

                            }
                            res.end(`
<!DOCTYPE html>
<html>
	<head>
		<title>Store</title>
		<script src="source.js"></script>
		<script>
			/**
 * This function updates the URLs for all the links on a page. 
 */
function updateUrls() {
      const username = localStorage.getItem('username');
      const role = localStorage.getItem('role');
      if (username && role) {
        const alist = document.getElementsByTagName('a');
        for (let i = 0; i < alist.length; i++) {
          const a = alist[i];
          const url = new URL(a.href, window.location.origin);
          url.searchParams.set('username', username);
          url.searchParams.set('role', role);
          a.href = url.toString();
        }
      }
    }
    window.onload = function(){
      updateUrls();
    }

		</script>
	</head>
	<body>
		<a href="#" onclick="sendReq('logout')">Logout</a>
		<table id="storeListings">
			<tr>
				<td>Title</td>
				<td>Price</td>
			</tr>
		</table>
		<script>
			var items = ${items}
			var table = document.getElementById('storeListings');
			for(var i = 0; i < items.length; i++){
				var tr = document.createElement('tr');
				var td1 = document.createElement('td');
				var td2 = document.createElement('td');
				td1.innerHTML = items[i].title;
				td2.innerHTML = items[i].price;
				tr.appendChild(td1);
				tr.appendChild(td2);
				table.appendChild(tr);
			}
		</script>
	</body>
</html>`);
                            //var htmlContent = getHTMLContent('user-purchases.html');
                            //req.url = '/purchase-history';
                        }else if(query.role == 'seller'){
                            var htmlContent = getHTMLContent('upload-book.html');
                            resEnd(res, htmlContent);
                        }else{
                            var reports = await database.getReports(db);
                            if(reports.length == 0){
                                res.end("There are currently no reports to view");
                            }
                            var reportItems  = JSON.stringify(reports);
                            res.end(`<!--This will be the store page-->
<!DOCTYPE html>
<html>
	<head>
		<title>Reports</title>
		<script src="source.js"></script>
		<script>
			/**
 * This function updates the URLs for all the links on a page. 
 */
function updateUrls() {
      const username = localStorage.getItem('username');
      const role = localStorage.getItem('role');
      if (username && role) {
        const alist = document.getElementsByTagName('a');
        for (let i = 0; i < alist.length; i++) {
          const a = alist[i];
          const url = new URL(a.href, window.location.origin);
          url.searchParams.set('username', username);
          url.searchParams.set('role', role);
          a.href = url.toString();
        }
      }
    }
    window.onload = function(){
      updateUrls();
    }

		</script>
	</head>
	<body>
		<a href="#" onclick="sendReq('logout')">Logout</a>
		<table id="storeListings">
			<tr>
				<td>Name</td>
				<td>Email</td>
                <td>Message</td>
			</tr>
		</table>
		<script>
			var items = ${reportItems}
			var table = document.getElementById('storeListings');
			for(var i = 0; i < items.length; i++){
				var tr = document.createElement('tr');
				var td1 = document.createElement('td');
				var td2 = document.createElement('td');
                var td3 = document.createElement('td');
				td1.innerHTML = items[i].name;
				td2.innerHTML = items[i].email;
                td3.innerHTML = items[i].message;
				tr.appendChild(td1);
				tr.appendChild(td2);
                tr.appendChild(td3);
				table.appendChild(tr);
			}
		</script>
	</body>
</html>`
);
                            //var htmlContent = getHTMLContent('admin_reports.html');
                            //req.url = '/reports';
                        }
                        //res.end(htmlContent);
                    }else{
                        res.end(getHTMLContent('login.html') + '<p>Invalid login credenetials, please try again</p>')
                    }
                })
            }
            //Serve report.html and the associated form action
            else if(req.url.includes('create_user')){
                res.writeHead(200, {'Content-Type': 'text/html'});
                var htmlContent = getHTMLContent('create_user.html');
                resEnd(res, htmlContent);
            }
            else if(req.url.includes('create_account_submit') && req.method === 'POST'){
                res.writeHead(200, {'Content-Type': 'text/html'});
                let body = '';
                req.on('data', chunk => {
                    console.log('Chunk received: ', chunk);
                    body += chunk
                });
                req.on('end', async () => {
                    try{
                        console.log('entered');
                        const parsed = qs.parse(body);
                        console.log('Parsed data:', parsed);
                        await database.addUser(db, parsed);
                        var htmlContent = getHTMLContent('success.html');
                        resEnd(res, htmlContent);
                    }catch(err){
                        console.error('Error submitting report: ', err);
                        res.end('<h1>Failed to submit report.</h1>');
                    }
                    
                });
            }
            
            //Serve success.html
            else if(req.url.includes('success')){
                res.writeHead(200, {'Content-Type': 'text/html'});
                var htmlContent = getHTMLContent('success.html');
                resEnd(res, htmlContent);
            }
            
            //Serve logout.html
            else if(req.url.includes('logout')){
                res.writeHead(200, {'Content-Type': 'text/html'});
                var htmlContent = getHTMLContent('logout.html');
                resEnd(res, htmlContent);
            }
            //Serve report.html and the associated form action
            else if(req.url.includes('submit-report')){
                res.writeHead(200, {'Content-Type': 'text/html'});
                var htmlContent = getHTMLContent('report.html');
                resEnd(res, htmlContent);
            }
            else if(req.url.includes('submit_report_form')){
                res.writeHead(200, {'Content-Type': 'text/html'});
                let body = '';
                req.on('data', chunk => {
                    console.log('Chunk received: ', chunk);
                    body += chunk
                });
                req.on('end', async () => {
                    try{
                        const parsed = qs.parse(body);
                        console.log('Parsed data:', parsed);
                        await database.addReport(db, parsed);
                        var htmlContent = getHTMLContent('success.html');
                        resEnd(res, htmlContent);
                    }catch(err){
                        console.error('Error submitting report: ', err);
                        res.end('<h1>Failed to submit report.</h1>');
                    }
                    
                });
            }
            //Serve upload-book.html and its associated form action
            else if(req.url.includes('upload-book')){
                res.writeHead(200, {'Content-Type': 'text/html'});
                var htmlContent = getHTMLContent('upload-book.html');
                resEnd(res, htmlContent);
            }
            else if(req.url.includes('submit-book')){
                res.writeHead(200, {'Content-Type': 'text/html'});
                var body = ''
                req.on('data', function(s){
                    body += s
                });
                req.on('end', async function(){
                    var query = qs.parse(body);
                    await database.addBook(db, query);
                    await database.addItemToSellerInventory(db, query.username, query.title, query.price);
                    var htmlContent = getHTMLContent('success.html');
                    resEnd(res, htmlContent);
                })
            }
            
            //Serve source.js for linking between pages
            else if(req.url.includes('source.js')){
                res.writeHead(200, {'Content-Type': 'application/javascript'});
                try{
                    var content = fs.readFileSync('source.js', {'encoding':'utf8'})
                    res.end(content)
                }catch(err){
                    console.log(err)
                }
            //No other page is valid, so serve "Page not found"
            }else{
                res.writeHead(200, {'Content-Type': 'text/html'});
                var htmlContent = getHTMLContent('invalid-page.html');
                resEnd(res, htmlContent);
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
