if(CurSite.COMP.BookChapterList == undefined) {

    var BookChapterList = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self.skip = config.skip;
        self.limit = config.limit;
        self.count = config.count;
        self.bookId = config.bookId;
        self.url = './book_chapterList.html';
        self._init();
    };

    BookChapterList.prototype._init = function()
    {
        var self = this;

        //新增书籍
        $('#' + self.id + "_add").on("click", function(){
            var url = $(this).attr("url");

            var id = CurSite.createUUID();
            CurSite.getHtml(url, {id:id, parent:self.parent, book_id:self.bookId}, function(err, data){
                $('#' + self.parent).html(data);
            });
        });

        //查看详情
        $("button[flag='" + self.id + "_detail']").on('click', function (event) {
            var chapter_id =  $(this).attr("tId");
            $('#' + self.id + '_myModal').modal("show");
            var pageData = {
                id:CurSite.createUUID(),
                parent:self.id + '_myModalBody',
                chapter_id:chapter_id,
                book_id:self.bookId
            };
            CurSite.getHtml("./book_blockList.html", pageData, function(err, data){
                $('#' + self.id + '_myModalBody').html(data);
            });
        });

        $("button[flag='" + self.id + "_delete']").on('click', function (event) {
            var id =  $(this).attr("tId");
            if (confirm("确认要删除？")) {
                var body = {
                    id:id
                };
                CurSite.postDigest({cmd:"BK04"}, null, body, function(err, backBody){
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
    BookChapterList.prototype.getCond = function()
    {
        var self = this;
        var cond = {};
        return cond;
    };

    /**
     * 获得额外条件
     */
    BookChapterList.prototype.getAdd = function()
    {
        var self = this;
        var add = {};
        return add;
    };

    /**
     * 跳转到指定页
     * @param index
     */
    BookChapterList.prototype.toPage = function(index)
    {
        var self = this;
        var url = self.url;
        var id = CurSite.createUUID();
        var pageData = {
            id:id,
            parent:self.parent,
            bookId:self.bookId,
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

    CurSite.COMP.BookChapterList = BookChapterList;
}