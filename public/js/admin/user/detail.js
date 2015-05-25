if(CurSite.COMP.AdminUserDetail == undefined) {

    var AdminUserDetail = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self.customer_id = config.customer_id;
        self._init();
    };

    AdminUserDetail.prototype._init = function()
    {
        var self = this;

        $('#' + self.id + "_save").click(function(event){
            var password = $('#' + self.id + "_password").val();
            var status = $('#' + self.id + "_status").val();
            var data = {
                customer_id:self.customer_id,
                password:password,
                status:status
            }
            CurSite.postDigest({cmd:"AD04"}, null, data, function(err, backBody){
                if(err)
                {
                    alert(err.description);
                }
                else
                {
                    alert("操作成功")
                }
            });
        });

    };

    AdminUserDetail.prototype._toPage = function(url)
    {
        var self = this;
        var id = CurSite.createUUID();
        var pgData = {};
        pgData.id = id;
        pgData.parent = self.parent;
        CurSite.getHtml(url, pgData, function(err, data){
            $('#' + self.parent).html(data);
        });
    };

    CurSite.COMP.AdminUserDetail = AdminUserDetail;
}