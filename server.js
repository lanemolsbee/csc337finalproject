var http = require('http')
var url = require('url')
var fs = require('fs')
var crypto = require('crypto')
var qs = require('querystring')
var userList = []

function checkLogin(username, role, password){
    for(var i=0;i<userList.length;i++)
    {
        var user = userList[i]
        if((user.username==username)&&(user.role==role)&&(user.password == password)){
            return true
        }
    }
    return false
}

http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
}).listen(8080);