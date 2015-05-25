if(CurSite.COMP.AdminTaskAdd == undefined) {

    var AdminTaskAdd = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self._init();
    };

    AdminTaskAdd.prototype._init = function()
    {
        var self = this;
        var submitButton = $('#' + self.id + '_submit');
        submitButton.on("click", function(){
            var data = self._getData();
            if(self._check(data))
            {
                CurSite.postDigest({cmd:"AD05"}, null, data, function(err, backBody){
                    if(err)
                    {
                        alert(err.description);
                    }
                    else
                    {
                        self._toPage("admin_goods_list.html")
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
    AdminTaskAdd.prototype._getData = function()
    {
        var self = this;
        var data = {};
        var name = $('#' + self.id + '_name').val();
        data.name = name;
        var num = $('#' + self.id + '_num').val();
        data.num = parseInt(num);
        var amount = $('#' + self.id + '_amount').val();
        data.amount = parseInt(amount);
        var remark = $('#' + self.id + '_remark').val();
        data.remark = remark;
        return data;
    };

    AdminTaskAdd.prototype._check = function(data)
    {
        return true;
    };

    /**
     * 跳转到指定页
     * @param index
     */
    AdminTaskAdd.prototype._toPage = function(url)
    {
        var self = this;
        var id = CurSite.createUUID();
        var pageData = {
            id:id,
            parent:self.parent
        };
        CurSite.getHtml(url, pageData, function(err, data){
            $('#' + self.parent).html(data);
        });
    };

    CurSite.COMP.AdminTaskAdd = AdminTaskAdd;
}