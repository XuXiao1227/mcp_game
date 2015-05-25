if(CurSite.COMP.UserFileNewFolder == undefined) {

    var UserFileNewFolder = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self._init();
    };

    UserFileNewFolder.prototype._init = function()
    {
        var self = this;

    };

    CurSite.COMP.UserFileNewFolder = UserFileNewFolder;
}