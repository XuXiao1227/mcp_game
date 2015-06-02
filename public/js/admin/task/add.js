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
                CurSite.postDigest({cmd:"AD06"}, null, data, function(err, backBody){
                    if(err)
                    {
                        alert(err.description);
                    }
                    else
                    {
                        self._toPage("admin_task_list.html")
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
        var reward_exp = $('#' + self.id + '_rewardExp').val();
        data.reward_exp = parseInt(reward_exp);
        var reward_gold = $('#' + self.id + '_rewardGold').val();
        data.reward_gold = parseInt(reward_gold);
        var description = $('#' + self.id + '_description').val();
        data.description = description;
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