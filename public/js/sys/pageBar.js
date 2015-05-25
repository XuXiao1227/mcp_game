if(CurSite.COMP.SysPageBar == undefined) {

    var SysPageBar = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self.parentId = config.parentId;
        self._init();
    };

    SysPageBar.prototype._init = function()
    {
        var self = this;
        console.log(self.parentId);
        $('a[flag="' + self.id + '"]').on("click", function(){
            var pIndex = parseInt($(this).attr("pIndex"));
            if(pIndex > 0)
            {
                var parentComp = CurSite.IMPL[self.parentId];
                parentComp.toPage(pIndex);
            }
        });
    };

    CurSite.COMP.SysPageBar = SysPageBar;
}

