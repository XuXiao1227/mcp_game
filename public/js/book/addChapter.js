if(CurSite.COMP.BookAddChapter == undefined) {

    var BookAddChapter = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self.book_id = config.book_id;
        self.listUrl = './book_chapterList.html';
        self._init();
    };

    BookAddChapter.prototype._init = function()
    {
        var self = this;
        var submitButton = $('#' + self.id + '_submit');
        submitButton.on("click", function(){
            var name = $('#' + self.id + '_name').val();
            var chapter = {
                name:name,
                book_id:self.book_id
            };
            CurSite.postDigest({cmd:"BK03"}, null, chapter, function(err, backBody){
                if(err)
                {
                    alert(err.description);
                }
                else
                {
                    submitButton.html("操作成功");
                    self._toListPage();
                }
            });
        });
    };

    /**
     * 跳转到列表页面
     * @private
     */
    BookAddChapter.prototype._toListPage = function()
    {
        var self = this;
        var id = CurSite.createUUID();
        CurSite.getHtml(self.listUrl, {id:id, parent:self.parent, bookId:self.book_id}, function(err, data){
            $('#' + self.parent).html(data);
        });
    };

    CurSite.COMP.BookAddChapter = BookAddChapter;
}