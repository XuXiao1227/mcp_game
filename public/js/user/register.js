$(function () {
    $('[data-toggle="tooltip"]').tooltip({
        container:'body'
    })

    var check = function()
    {
        var username = $('#username').val();
        if(!/^[a-z|A-Z|0-9|@|_]{6,40}$/.test(username))
        {
            $('#username').focus();
            return false;
        }
        var nickname = $('#nickname').val();
        if(!/^[a-z|A-Z|0-9|@|_]{6,32}$/.test(password))
        {
            $('#nickname').focus();
            return false;
        }
        var password = $('#password').val();
        if(!/^[a-z|A-Z|0-9|@|_]{6,32}$/.test(password))
        {
            $('#password').focus();
            return false;
        }
        var confirm = $('#confirm').val();
        if(confirm != password)
        {
            $('#confirm').focus();
            return false;
        }
        return true;
    }

    $('#login').on('click', function () {
        if(check())
        {
            var $btn = $(this).button('loading');

            var username = $('#username').val();
            var nickname = $('#nickname').val();
            var password = $('#password').val();
            var body = {username:username, nickname:nickname, password:password};
            CurSite.postUnDigest({cmd:"U02"}, body, function(err, backBody){
                if(err)
                {
                    alert(err.description);
                    $btn.button('reset');
                }
                else
                {
                    window.location = './user_login.html';
                }
            });
        }
    })
})