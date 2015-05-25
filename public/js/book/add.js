if(CurSite.COMP.BookAdd == undefined) {

    var BookAdd = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self._init();
    };

    BookAdd.prototype._init = function()
    {
        var self = this;
        var submitButton = $('#' + self.id + '_submit');
        submitButton.on("click", function(){
            var name = $('#' + self.id + '_name').val();
            var book_type_id = $('#' + self.id + '_type').val();
            var remark = $('#' + self.id + '_remark').val();
            var body = {
                name:name,
                remark:remark,
                book_type_id:book_type_id
            };
            CurSite.postDigest({cmd:"BK01"}, null, body, function(err, backBody){
                if(err)
                {
                    alert(err.description);
                }
                else
                {
                    alert("操作成功");
                }
            });
        });
    };

    CurSite.COMP.BookAdd = BookAdd;
}