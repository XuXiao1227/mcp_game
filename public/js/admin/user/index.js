if(CurSite.COMP.AdminUserIndex == undefined) {

    var AdminUserIndex = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self.contentId = self.id + '_content';
        self._init();
    };

    AdminUserIndex.prototype._init = function()
    {
        var self = this;

        //查询
        $('#' + self.id + '_search').on('click', function (event) {
            self._toPage('/admin_user_listCustomer.html');
        });

        self._toPage('/admin_user_listCustomer.html');
    };

    AdminUserIndex.prototype._toPage = function(url)
    {
        var self = this;
        var id = CurSite.createUUID();
        var pgData = {};
        pgData.id = id;
        pgData.parent = self.contentId;
        CurSite.getHtml(url, pgData, function(err, data){
            $('#' + self.contentId).html(data);
        });
    };

    CurSite.COMP.AdminUserIndex = AdminUserIndex;
}