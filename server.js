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
        const server = http.createServer(function(req, res){
            res.writeHead(200, {'Content-Type': 'text/html'});
            //Serve index.html
            if(req.url == '/'){
                res.writeHead(200, {'Content-Type': 'text/html'});
                var htmlContent = getHTMLContent('index.html');
                resEnd(res, htmlContent);
            }
            //Serve about.html
            else if(req.url == '/about'){
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
            else if(req.url.includes('login-form')){
                res.writeHead(200, {'Content-Type': 'text/html'});
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
            //Serve the form to create the user. 
            else if(req.url.includes('create_user')){
                res.writeHead(200, {'Content-Type': 'text/html'});
                var htmlContent = getHTMLContent('create_user.html');
                resEnd(res, htmlContent);
            }
            else if(req.url.includes('create_user_submit')){
                res.writeHead(200, {'Content-Type': 'text/html'});
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
            //Serve success.html
            else if(req.url.includes('success')){
                res.writeHead(200, {'Content-Type': 'text/html'});
                var htmlContent = getHTMLContent('success.html');
                resEnd(res, htmlContent);
            }
            
            //Serve store.html, which is the contents of the store as it exists now
            else if(req.url.includes("store")){
                res.writeHead(200, {'Content-Type': 'text/html'});
                var storeContents = getStoreInventory();
                res.end(`<!--This will be the store page-->
<!DOCTYPE html>
<html>
	<head>
		<title>Store</title>
		<script src="source.js"></script>
		<script>
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
		</script>
	</head>
	<body onload="updateUrls()">
		<a href="#" onclick="sendReq('purchase-history')">Purchase History</a>
		<a href="#" onclick="sendReq('store')">Store</a>
		<table id="storeListings">
			<tr>
				<td>Title</th>
				<td>Price</th>
			</tr>
		</table>
		<script>
			var items = ${storeContents}
			var table = document.getElementById('storeListings');
			for(var i = 0; i < items.length; i++){
				var tr = document.createElement('tr');
				var td1 = document.createElement('td');
				var rd2 = document.createElement('td');
				td1.innerHTML = items[i].title;
				td2.innerHTML = items[i].price;
				tr.appendChild(td1);
				tr.appendChild(td2);
				table.appendChild(tr);
			}
		</script>
	</body>
</html>`);

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
            else if(req.url.includes('submit_report')){
                res.writeHead(200, {'Content-Type': 'text/html'});
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
                    var query = qs.parseBody(body);
                    await database.addBook(db, query);
                    await database.addItemToSellerInventory(db, query.username, query.title, query.price);
                    var htmlContent = getHTMLContent('success.html');
                    resEnd(res, htmlContent);
                })
            }
            
            //Serve admin_reports.html, the list of reports for Admins to view
            else if(req.url.includes('view-reports')){
                res.writeHead(200, {'Content-Type': 'text/html'});
                var reports = getReports();
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
		</script>
	</head>
	<body onload="updateUrls()">
		<a href="#" onclick="sendReq('logout')">Logout</a>
		<table id="storeListings">
			<tr>
				<td>Name</td>
				<td>Email</td>
                <td>Message</td?
			</tr>
		</table>
		<script>
			var items = ${reports}
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
</html>`);

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
