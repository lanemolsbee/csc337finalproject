var http = require('http');
var url = require('url');

http.createServer(function (req, res) {
    var q = url.parse(req.url, true).query;
    var username = q.username;
    var role = q.role;
    var password = q.password;

    res.writeHead(200, { 'Content-Type': 'text/html' });

    if (username && role) {
        if (role === "back again") {
            res.end(`<!DOCTYPE html>
<html>
    <body>
        <script>
            var storedPassword = localStorage.getItem('${username}_password');
            if (storedPassword && storedPassword === "${password}") {
                document.write('<h1>Welcome back, ${username}!</h1>');
            } else {
                document.write('<h1>Try again!</h1>');
            }
        </script>
    </body>
</html>
`);
        } else if (role === "new user") {
            res.end(`<!DOCTYPE html>
<html>
    <body>
        <script>
            localStorage.setItem('${username}_password', "${password}");
            document.write('<h1>Welcome, ${username}!</h1>');
            alert('Password has been saved for future logins.');
        </script>
    </body>
</html>
`);
        } else {
            res.end(`<!DOCTYPE html>
<html>
    <body>
        <h1>Welcome, ${username}!</h1>
    </body>
</html>
`);
        }
    } else {
        res.end(`<!DOCTYPE html>
<html>
    <body>

     <style>
        body {
            background-color: black;
            color: white;
        }
        a {
            color: green;
        }
    </style>
        <h1>Welcome!</h1>
        <form id="loginForm">
            <label for="role">Role:</label>
            <select id="role" name="role">
                <option value="back again">Back again</option>
                <option value="new user">New user</option>
            </select><br><br>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username"><br><br>
            <label for="password">Password:</label>
            <input type="text" id="password" name="password"><br><br>
            <button type="button" onclick="saveToLocalStorage()">Submit</button>
        </form>
        <script>
            function saveToLocalStorage() {
                var username = document.getElementById('username').value;
                var role = document.getElementById('role').value;
                var password = document.getElementById('password').value;
                var newURL = window.location.protocol + "//" + window.location.host + "?username=" + username + "&role=" + role + "&password=" + password;
                window.location.href = newURL;
            }
        </script>
    </body>
</html>
`);
    }
}).listen(8080);

console.log('Server started on port 8080...');
