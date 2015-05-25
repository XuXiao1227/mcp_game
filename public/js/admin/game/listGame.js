if(CurSite.COMP.AdminGameListGame == undefined) {

    var AdminGameListGame = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self.skip = config.skip;
        self.limit = config.limit;
        self.count = config.count;
        self.url = './admin_game_listGame.html';
        self._init();
    };

    AdminGameListGame.prototype._init = function()
    {
        var self = this;

        //点击搜索，则刷新当前页
        $('#' + self.id + '_search').on('click', function (event) {
            self.toPage();
        });

        //开售
        $("button[flag='" + self.id + "_open']").on('click', function (event) {
            var gameId =  $(this).attr("tId");
            var body = {
                id:gameId,
                status:1
            };
            CurSite.postDigest({cmd:"AD02"}, null, body, function(err, backBody){
                if(err)
                {
                    alert(err.description);
                }
                else
                {
                    self.toPage();  //刷新页面
                }
            });
        });

        //停售
        $("button[flag='" + self.id + "_stop']").on('click', function (event) {
            var gameId =  $(this).attr("tId");
            var body = {
                id:gameId,
                status:0
            };
            CurSite.postDigest({cmd:"AD02"}, null, body, function(err, backBody){
                if(err)
                {
                    alert(err.description);
                }
                else
                {
                    self.toPage();  //刷新页面
                }
            });
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

    /**
     * 跳转到指定页
     * @param index
     */
    AdminGameListGame.prototype.toPage = function(index)
    {
        var self = this;
        var url = self.url;
        var id = CurSite.createUUID();
        var pageData = {
            id:id,
            parent:self.parent,
            limit:self.limit,
            cond:self.getCond(),
            add:self.getAdd()
        };
        if(index == undefined)
        {
            pageData.skip = self.skip;
        }
        else
        {
            pageData.skip = (index - 1)*self.limit;
        }
        CurSite.getHtml(url, pageData, function(err, data){
            $('#' + self.parent).html(data);
        });
    };

    /**
     * 查询条件
     * @returns {{}}
     */
    AdminGameListGame.prototype.getCond = function()
    {
        var self = this;
        var cond = {};
        var code = $('#' + self.id + '_code').val();
        if(code)
        {
            cond.code = code;
        }
        return cond;
    };

    /**
     * 获得额外条件
     */
    AdminGameListGame.prototype.getAdd = function()
    {
        var self = this;
        var add = {};
        return add;
    };

    CurSite.COMP.AdminGameListGame = AdminGameListGame;
}