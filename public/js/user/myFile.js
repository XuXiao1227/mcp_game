if(CurSite.COMP.UserMyFile == undefined) {

    var UserMyFile = function(config)
    {
        var self = this;
        console.log(config);
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self.skip = config.skip;   //当前第一页
        self.limit = config.limit;    //每页10条
        self.count = config.count;
        self.url = './user_myFile.html';
        self._init();
    };

    UserMyFile.prototype._init = function()
    {
        var self = this;

        //下载文件
        $("button[flag='" + self.id + "_download']").on('click', function (event) {
            var url = CurSite.host +  ":8081?";
            url += "fileId=" + $(this).attr("tId");
            window.open(url);
        });

        //点击搜索，则刷新当前页
        $('#' + self.id + '_search').on('click', function (event) {
            if(self.check())
            {
                self.toPage();
            }
        });

        //删除文件
        $("button[flag='" + self.id + "_delete']").on('click', function (event) {
            var fileId = parseInt($(this).attr("tId"));
            if (confirm("确认要删除？")) {
                var body = {
                    fileId:fileId
                };
                CurSite.postDigest({cmd:"U03"}, null, body, function(err, backBody){
                    if(err)
                    {
                        alert(err.description);
                    }
                    else
                    {
                        self.toPage();  //刷新页面
                    }
                });
            }
        });

        //加载分页组件
        var id = CurSite.createUUID();
        var pageData = {
            id:id,
            parent:self.id + '_pageBar',
            parentId:self.id,
            skip:self.skip,
            limit:self.limit,
            count:self.count
        };
        CurSite.getHtml('./sys_pageBar.html', pageData, function(err, data){
            $('#' + self.id + '_pageBar').html(data);
        });

    };

    UserMyFile.prototype.check = function()
    {
        var self = this;
        var cond = self.getCondition();
        return true;
    };

    /**
     * 获得条件
     */
    UserMyFile.prototype.getCondition = function()
    {
        var self = this;
        var cond = {};
        var type = parseInt($('#' + self.id + '_type').val());
        if(type > -1)
        {
            cond.type = type;
        }
        return cond;
    };

    /**
     * 跳转到指定页
     * @param index
     */
    UserMyFile.prototype.toPage = function(pIndex)
    {
        var self = this;
        var skip = 0;
        if(pIndex)
        {
            skip = (pIndex - 1)*self.limit;
        }
        var config = {};
        config.id = CurSite.createUUID();
        config.parent = self.parent;
        config.skip = skip;
        config.limit = self.limit;
        var cond = self.getCondition();
        config.cond = JSON.stringify(cond);
        CurSite.getHtml(self.url, config, function(err, data){
            $('#' + self.parent).html(data);
        });
    };

    CurSite.COMP.UserMyFile = UserMyFile;
}