if(CurSite.COMP.UserSelectImg == undefined) {

    var UserSelectImg = function(config)
    {
        var self = this;
        self.id = config.id;
        self._init();
    };

    /**
     * 初始化组件
     * @private
     */
    UserSelectImg.prototype._init = function()
    {
        var self = this;
    };

    /**
     * 获得单选的值
     * @returns {*|jQuery}
     */
    UserSelectImg.prototype.getSingle = function()
    {
        var self = this;
        var name = self.id + "_select";
        return $('input[name="' + name + '"]:checked').val();
    };

    CurSite.COMP.UserSelectImg = UserSelectImg;
}