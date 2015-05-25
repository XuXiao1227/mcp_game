if(CurSite.COMP.AdminSysLogin == undefined) {

    var AdminSysLogin = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self._init();
    };

    AdminSysLogin.prototype._init = function()
    {
        var self = this;
        $('#login').on('click', function () {
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
            CurSite.setCookie("userType", "ADMIN", -1);
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
                    window.location = "./admin_sys_index.html";
                }
            });
        })
    };
    CurSite.COMP.AdminSysLogin = AdminSysLogin;
}

var id = CurSite.createUUID();
CurSite.IMPL[id] = new CurSite.COMP.AdminSysLogin({id:id, parent:null});

