if(CurSite.COMP.SysDoc == undefined) {

    var SysDoc = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self._init();
    };

    SysDoc.prototype._init = function()
    {
        var self = this;
    };

    CurSite.COMP.SysDoc = SysDoc;
}