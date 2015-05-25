if(CurSite.COMP.AdminGameAddGameLevel == undefined) {

    var AdminGameAddGameLevel = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self._init();
    };

    AdminGameAddGameLevel.prototype._init = function()
    {
        var self = this;
        var submitButton = $('#' + self.id + '_submit');
        submitButton.on("click", function(){
            var data = self._getData();
            if(self._check(data))
            {
                CurSite.postDigest({cmd:"AD03"}, null, data, function(err, backBody){
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
    AdminGameAddGameLevel.prototype._getData = function()
    {
        var self = this;
        var data = {};
        data.game_code = $('#' + self.id + '_game_code').val();
        var name = $('#' + self.id + '_name').val();
        data.name = name;
        var code = $('#' + self.id + '_code').val();
        data.code = parseInt(code);
        data.hit_rule = $('#' + self.id + '_hit_rule').val();
        data.hit_amount = parseInt($('#' + self.id + '_hit_amount').val());
        return data;
    };

    AdminGameAddGameLevel.prototype._check = function(data)
    {
        return true;
    };

    CurSite.COMP.AdminGameAddGameLevel = AdminGameAddGameLevel;
}