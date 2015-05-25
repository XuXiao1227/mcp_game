if(CurSite.COMP.UserMyInfo == undefined) {

    var UserMyInfo = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self._init();
    };

    /**
     * 初始化组件
     * @private
     */
    UserMyInfo.prototype._init = function()
    {
        var self = this;
        $('#' + self.id + "_upload").on("click", function(){
            var url = $(this).attr("url");
            var config = {id:CurSite.createUUID()};
            if(CurSite.loadFlag['Ias'] == undefined)
            {
                config.loadIas = true;  //加载imagearea插件
            }
            CurSite.getHtml(url, config, function(err, data){
                $('#' + self.parent).html(data);
            });
        });

        $('#' + self.id + "_modify").on("click", function(){
            var url = $(this).attr("url");
            var config = {id:CurSite.createUUID()};
            if(CurSite.loadFlag['Ias'] == undefined)
            {
                config.loadIas = true;  //加载imagearea插件
            }
            CurSite.getHtml(url, config, function(err, data){
                $('#' + self.parent).html(data);
            });
        });

    };

    CurSite.COMP.UserMyInfo = UserMyInfo;
}