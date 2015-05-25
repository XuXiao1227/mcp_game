if(CurSite.COMP.UserIndex == undefined) {

    var UserIndex = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self.toUrl = config.toUrl;
        if(config.data)
        {
            self.data = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(config.data)));
        }
        self._init();
    };

    UserIndex.prototype._init = function()
    {
        var self = this;

        $('#pInfo').on('click', function () {
            self._toPage("./user_myInfo.html");
        })

        $('#ticketInfo').on('click', function () {
            self._toPage("./user_ticket_listTicket.html");
        })

        $('#cmd').on('click', function () {
            self._toPage("./sys_cmd.html");
        })

        $('#doc').on('click', function () {
            self._toPage("./sys_doc.html");
        })

    };


    UserIndex.prototype._toPage = function(url, pgData)
    {
        var self = this;
        var id = CurSite.createUUID();
        if(pgData == undefined)
        {
            pgData = {};
        }
        pgData.id = id;
        pgData.parent = 'content';
        CurSite.getHtml(url, pgData, function(err, data){
            $('#content').html(data);
        });
    };

    CurSite.COMP.UserIndex = UserIndex;
}