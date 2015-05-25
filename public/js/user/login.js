$('#login').on('click', function () {
    //var $btn = $(this).button('loading')
    var username = $('#username').val();
    var password = $('#password').val();
    if(username.length == 0)
    {
        return;
    }
    if(password.length == 0)
    {
        return;
    }
    CurSite.setCookie("userId", username, -1);
    CurSite.setCookie("userType", "NORMAL", -1);
    var body = {username:username, password:password};
    var key = CryptoJS.MD5(password).toString();
    CurSite.postDigest({cmd:"U01"}, key, body, function(err, backBody){
        if(err)
        {
            alert(err.description);
        }
        else
        {
            CurSite.setCookie("st", backBody.st, -1);
            CurSite.setCookie("userId", backBody.userId, -1);
            window.location = "./user_index.html";
        }
    });
})