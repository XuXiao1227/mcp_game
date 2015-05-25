if(CurSite.COMP.AdminUserListCustomer == undefined) {

    var AdminUserListCustomer = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self.skip = config.skip;
        self.limit = config.limit;
        self.count = config.count;
        self.url = './admin_user_listCustomer.html';
        self._init();
    };

    AdminUserListCustomer.prototype._init = function()
    {
        var self = this;

        //点击搜索，则刷新当前页
        $('#' + self.id + '_search').on('click', function (event) {
            self.toPage();
        });

        //详情
        $("button[flag='" + self.id + "_detail']").on('click', function (event) {
            var customerId =  $(this).attr("tId");
            var id = CurSite.createUUID();
            var pageData = {
                id:id,
                parent:self.parent,
                customerId:customerId
            };
            CurSite.getHtml('admin_user_detail.html', pageData, function(err, data){
                $('#' + self.parent).html(data);
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
    AdminUserListCustomer.prototype.toPage = function(index)
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
    AdminUserListCustomer.prototype.getCond = function()
    {
        var self = this;
        var cond = {};
        var username = $('#' + self.id + '_username').val();
        if(username)
        {
            cond.username = username;
        }
        return cond;
    };

    /**
     * 获得额外条件
     */
    AdminUserListCustomer.prototype.getAdd = function()
    {
        var self = this;
        var add = {};
        return add;
    };

    CurSite.COMP.AdminUserListCustomer = AdminUserListCustomer;
}