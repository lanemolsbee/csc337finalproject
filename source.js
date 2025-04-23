function sendReq(url){
    fetch(url)
    .then(function(res){
        return res.text();
    })
    .then(function(text){
        document.open()
        document.write(text)
        document.close()
    })
    .catch(function(err){
        console.log(err)
    })
}