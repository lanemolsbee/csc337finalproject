function sendReq(url){
    var username = window.localStorage.getItem("username");
    var role = window.localStorage.getItem("role");
    if(username != null && role != null){
        var par = "?username=" + username + "&role=" + role;
        url += par;
    }
    fetch(url)
    .then(function(res){
        return res.text();
    })
    .then(function(text){
        document.open();
        document.write(text);
        document.close();
    })
    .catch(function(err){
        alert("Error: unable to process request.");
        console.log(err);
    })
}