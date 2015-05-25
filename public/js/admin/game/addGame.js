if(CurSite.COMP.AdminGameAddGame == undefined) {

    var AdminGameAddGame = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self._init();
    };

    AdminGameAddGame.prototype._init = function()
    {
        var self = this;
        var submitButton = $('#' + self.id + '_submit');
        submitButton.on("click", function(){
            var data = self._getData();
            if(self._check(data))
            {
                CurSite.postDigest({cmd:"AD01"}, null, data, function(err, backBody){
                    if(err)
                    {
                        alert(err.description);
                    }
                    else
                    {
                        $('#' + self.parent).html("操作成功");
                    }
                });
            }
        });
    };

    /**
     * 获取数据集
     * @returns {{}}
     * @private
     */
    AdminGameAddGame.prototype._getData = function()
    {
        var self = this;
        var data = {};
        var name = $('#' + self.id + '_name').val();
        data.name = name;
        var code = $('#' + self.id + '_code').val();
        data.code = code;
        return data;
    };

    AdminGameAddGame.prototype._check = function(data)
    {
        return true;
    };

    CurSite.COMP.AdminGameAddGame = AdminGameAddGame;
}