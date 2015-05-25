if(CurSite.COMP.AdminBookType == undefined) {

    var AdminBookType = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self._init();
    };

    AdminBookType.prototype._init = function()
    {
        var self = this;

        //新增书籍
        $('#' + self.id + "_addType").on("click", function(){
            var url = $(this).attr("url");
            var id = CurSite.createUUID();
            CurSite.getHtml(url, {id:id, parent:self.parent}, function(err, data){
                $(self.parent).html(data);
            });
        });

        //查询书籍
        $('#' + self.id + "_listType").on("click", function(){
            var url = $(this).attr("url");
            var id = CurSite.createUUID();
            CurSite.getHtml(url, {id:id, parent:self.parent}, function(err, data){
                $(self.parent).html(data);
            });
        });

    };

    CurSite.COMP.AdminBookType = AdminBookType;
}