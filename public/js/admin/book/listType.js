if(CurSite.COMP.AdminBookListType == undefined) {

    var AdminBookListType = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self.skip = config.skip;
        self.limit = config.limit;
        self.count = config.count;
        self.url = './admin_book_listType.html';
        self._init();
    };

    AdminBookListType.prototype._init = function()
    {
        var self = this;
        $("button[flag='" + self.id + "_delete']").on('click', function (event) {
            var id =  $(this).attr("tId");
            if (confirm("确认要删除？")) {
                var body = {
                    id:id
                };
                CurSite.postDigest({cmd:"AB02"}, null, body, function(err, backBody){
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

        //点击搜索，则刷新当前页
        $('#' + self.id + '_search').on('click', function (event) {
            self.toPage();
        });

        //查看详情
        $("button[flag='" + self.id + "_detail']").on('click', function (event) {
            var bookTypeId =  $(this).attr("tId");
            $('#' + self.id + '_myModal').modal('show');
            var id = CurSite.createUUID();
            var pageData = {
                id:id,
                parent:self.parent,
                parentId:self.id,
                skip:self.skip,
                bookTypeId:bookTypeId
            };
            CurSite.getHtml("./admin_book_detailType.html", pageData, function(err, data){
                $('#' + self.id + '_myModalBody').html(data);
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
    AdminBookListType.prototype.toPage = function(index)
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
            $(self.parent).html(data);
        });
    };

    /**
     * 查询条件
     * @returns {{}}
     */
    AdminBookListType.prototype.getCond = function()
    {
        var self = this;
        var cond = {};
        var name = $('#' + self.id + '_name').val();
        if(name.length > 0)
        {
            cond.name = name;
        }
        return cond;
    };

    /**
     * 获得额外条件
     */
    AdminBookListType.prototype.getAdd = function()
    {
        var self = this;
        var add = {};
        return add;
    };

    CurSite.COMP.AdminBookListType = AdminBookListType;
}