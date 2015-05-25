if(CurSite.COMP.BookDetail == undefined) {

    var BookDetail = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self.selectImgId = CurSite.createUUID();
        self.bookId = config.bookId;
        self._init();
    };

    BookDetail.prototype._init = function()
    {
        var self = this;

        $('#' + self.id + "_upload").on('click', function(){
            $('#' + self.id + '_myModal').modal("show");
            CurSite.getHtml("./user_selectImg.html", {id:self.selectImgId}, function(err, data){
                $('#' + self.id + '_myModalBody').html(data);
            });
        });

        $('#' + self.id + '_select').on('click', function(e){
            var comp = CurSite.IMPL[self.selectImgId];
            var selectId = comp.getSingle();
            if(selectId != undefined)
            {
                var interData = {
                    bookId:self.bookId,
                    fileId:selectId
                };
                CurSite.postDigest({cmd:"U04"}, null, interData, function(err, backBody){
                    if(err)
                    {
                        alert(err.description);
                    }
                    else
                    {
                        $('#' + self.id + '_coverImg').attr('src', CurSite.fileSite + '?fileId=' + selectId);
                        $('#' + self.id + '_myModal').modal("hide");
                    }
                });
            }
        });

        //加载章节列表
        var id = CurSite.createUUID();
        var config = {
            id:id, parent:self.id + '_chapter',
            bookId:self.bookId
        };
        CurSite.getHtml("./book_chapterList.html", config, function(err, data){
            $('#' + self.id + '_chapter').html(data);
        });

    };

    CurSite.COMP.BookDetail = BookDetail;
}