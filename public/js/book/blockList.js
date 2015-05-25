if(CurSite.COMP.BookBlockList == undefined) {

    var BookBlockList = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self.skip = config.skip;
        self.limit = config.limit;
        self.count = config.count;
        self.chapter_id = config.chapter_id;
        self.book_id = config.book_id;
        self.url = './book_blockList.html';
        self.detailUrl = './book_detailBlock.html';
        self._init();
    };

    BookBlockList.prototype._init = function()
    {
        var self = this;

        //新增书籍
        $('#' + self.id + "_add").on("click", function(){
            var url = $(this).attr("url");

            var id = CurSite.createUUID();
            CurSite.getHtml(url, {id:id, parent:self.parent, chapter_id:self.chapter_id, book_id:self.book_id}, function(err, data){
                $('#' + self.parent).html(data);
            });
        });

        //查看详情
        $("button[flag='" + self.id + "_detail']").on('click', function (event) {
            var block_id =  $(this).attr("tId");
            /*var id = CurSite.createUUID();
            CurSite.getHtml(self.detailUrl, {id:id, parent:self.parent, block_id:block_id}, function(err, data){
                $('#' + self.parent).html(data);
            });*/
            var data = {block_id:block_id};
            var str = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
            window.open('./user_index.html?toUrl=' + encodeURIComponent(self.detailUrl) + "&data=" + CryptoJS.enc.Base64.stringify(str));
        });

        $("button[flag='" + self.id + "_delete']").on('click', function (event) {
            var id =  $(this).attr("tId");
            if (confirm("确认要删除？")) {
                var body = {
                    id:id
                };
                CurSite.postDigest({cmd:"BK06"}, null, body, function(err, backBody){
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

    /**
     * 查询条件
     * @returns {{}}
     */
    BookBlockList.prototype.getCond = function()
    {
        var self = this;
        var cond = {};
        return cond;
    };

    /**
     * 获得额外条件
     */
    BookBlockList.prototype.getAdd = function()
    {
        var self = this;
        var add = {};
        return add;
    };

    /**
     * 跳转到指定页
     * @param index
     */
    BookBlockList.prototype.toPage = function(index)
    {
        var self = this;
        var url = self.url;
        var id = CurSite.createUUID();
        var pageData = {
            id:id,
            parent:self.parent,
            chapter_id:self.chapter_id,
            book_id:self.book_id,
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

    CurSite.COMP.BookBlockList = BookBlockList;
}