if(CurSite.COMP.AdminBookDetailType == undefined) {

    var AdminBookDetailType = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self.parentId = config.parentId;    //控件所属容器
        self._init();
    };

    AdminBookDetailType.prototype._init = function()
    {
        var self = this;
    };

    CurSite.COMP.AdminBookDetailType = AdminBookDetailType;
}